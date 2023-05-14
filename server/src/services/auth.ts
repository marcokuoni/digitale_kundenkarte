import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'
import { CookieOptions, Request, Response } from 'express'
import bcrypt from 'bcrypt'

import {
  generateRefreshToken,
  refreshRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokenById,
} from '../services/authToken'
import User, { iUpdateUser } from '../models/user'
import {
  AUTHORIZATION,
  BEARER,
  UNKNOWN,
  USER_AGENT,
} from '../lib/const'
import { randomTokenString } from '../lib/helpers'
import {
  throwBadReuest,
  throwRedirectError,
  throwUnauthenticated,
} from '../lib/exceptions'
import { createUser } from './user'

const jwtKey = process.env.JWT_KEY as Jwt.Secret
const jwtRefreshKey = process.env.JWT_REFRESH_KEY as Jwt.Secret
const jwtExpiry = parseInt(process.env.JWT_EXPIRES_IN || '0')
const jwtRefreshExpiry = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '0')
const jwtRefreshCookieName =
  process.env.JWT_REFRESH_COOKIE_NAME || 'refresh_token'
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
}

export interface JwtUserPayloadInterface {
  token: string
}

export const signOut = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[jwtRefreshCookieName]
  if (refreshToken) {
    try {
      const userPayload = jwt.verify(
        refreshToken,
        jwtRefreshKey
      ) as JwtUserPayloadInterface

      await revokeRefreshToken(
        userPayload.token,
        req.socket.remoteAddress || '0.0.0.0',
        req.headers[USER_AGENT] || UNKNOWN
      )
    } catch (e) {
      //do nothing
    }
  }

  _clearTokensAndResponse(res)
}

export const signUp = async (
  req: Request,
  res: Response,
  successRedirect: string,
  newUser: iUpdateUser
) => {
  const user = await createUser(newUser)

  await signIn(req, res, successRedirect, user.transfercode, user.password)
}

export const signIn = async (
  req: Request,
  res: Response,
  successRedirect: string,
  transfercode: string,
  password?: string
) => {
  const user = await User.findOne({ transfercode: transfercode })

  if (!transfercode || !user) {
    throwBadReuest('User is not authenticated')
  }

  if (password || user.password) {
    const isMatch = password
      ? await bcrypt.compare(password, user.password)
      : false
    if (!isMatch) {
      throwBadReuest(
        'User is not authenticated, more access function not done now'
      )
    }
  }

  const refreshTokenDb = await generateRefreshToken(
    user._id,
    req.socket.remoteAddress || '0.0.0.0',
    req.headers[USER_AGENT] || UNKNOWN
  )

  const userPayload: JwtUserPayloadInterface = {
    token: refreshTokenDb.token,
  }

  const token = _createTokensAndResponse(res, userPayload)

  if (user) {
    //We do a redirect after login so the client does not cache the login page datas
    //We do this with a exception so the apollo server middleware does stop the request and the redirect can be done
    throwRedirectError(successRedirect, token)
  }
}

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = checkRefreshTokenExisting(req)

  try {
    const userPayload = jwt.verify(
      refreshToken,
      jwtRefreshKey
    ) as JwtUserPayloadInterface

    const newRefreshTokenDb = await refreshRefreshToken(
      userPayload.token,
      req.socket.remoteAddress || '0.0.0.0',
      req.headers[USER_AGENT] || UNKNOWN
    )
    const newUserPayload: JwtUserPayloadInterface = {
      token: newRefreshTokenDb.token,
    }

    _createTokensAndResponse(res, newUserPayload)
    return newUserPayload
  } catch (error) {
    _clearTokensAndResponse(res)
    console.error(error)
    throwBadReuest('User is not authenticated')
  }
}

export const revokeRefreshTokenManualy = async (req: Request, _id: string) => {
  await revokeRefreshTokenById(
    _id,
    req.socket.remoteAddress || '0.0.0.0',
    req.headers[USER_AGENT] || UNKNOWN
  )
}

export const checkRefreshTokenExisting = (req: Request) => {
  const refreshToken = req.cookies[jwtRefreshCookieName]
  if (!refreshToken) {
    throwUnauthenticated('User is not authenticated')
  }
  return refreshToken
}

const _clearTokensAndResponse = (res: Response) => {
  res.setHeader(AUTHORIZATION, `${BEARER}`).cookie(jwtRefreshCookieName, '', {
    maxAge: 0,
    ...cookieOptions,
  })
}

const _createTokensAndResponse = (
  res: Response,
  userPayload: JwtUserPayloadInterface
) => {
  const token = jwt.sign(userPayload, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpiry,
    issuer: process.env.SERVER_URL || 'https://karte.localhost',
    audience: process.env.CLIENT_URL || 'https://karte.localhost',
    jwtid: randomTokenString(),
  })
  const refreshToken = jwt.sign(userPayload, jwtRefreshKey, {
    algorithm: 'HS256',
    expiresIn: jwtRefreshExpiry,
    issuer: process.env.SERVER_URL || 'https://karte.localhost',
    audience: process.env.CLIENT_URL || 'https://karte.localhost',
    jwtid: randomTokenString(),
  })
  res
    .setHeader(AUTHORIZATION, `${BEARER} ${token}`)
    .cookie(jwtRefreshCookieName, refreshToken, {
      maxAge: jwtRefreshExpiry * 1000,
      ...cookieOptions,
    })

  return token
}
