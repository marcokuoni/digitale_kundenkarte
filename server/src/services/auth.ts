import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import { CookieOptions, Request, Response } from 'express'

import {
  getTokenUser,
  generateRefreshToken,
  refreshRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokenById,
} from '../services/token'
import User, { iUser } from '../models/user'
import { iNewUser } from '../resolvers/user'
import { AUTHORIZATION, BEARER, UNKNOWN, USER_AGENT } from '../lib/const'
import { randomTokenString } from '../lib/helpers'

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

export const checkAccessRights = (user?: iUser, isInGroup = []) => {
  if (!user) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }

  //TODO: check if user is allowed to do this (e.g. if user is admin) and then throw unauthorized error
  return true
}

export const verifyTokenAndGetUser = async (req: Request, res: Response) => {
  let jwtAccessToken = req.headers[AUTHORIZATION] as string

  if (jwtAccessToken && jwtAccessToken.indexOf(`${BEARER} `) >= 0) {
    jwtAccessToken = jwtAccessToken.split(' ')[1]
  }
  let userPayload: JwtUserPayloadInterface | null = null
  try {
    userPayload = jwt.verify(jwtAccessToken, jwtKey) as JwtUserPayloadInterface
  } catch (e) {
    //this is just working cause auth server is same as api server. but client works also without this refresh here, but needs one more request/roundtrip to refresh the access token
    const refreshToken = req.cookies[jwtRefreshCookieName]
    if (refreshToken) {
      userPayload = await refresh(req, res)
    }
  }

  if (userPayload) {
    const user = await getTokenUser(userPayload.token)
    return user
  }
  return null
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

export const revokeRefreshTokenManualy = async (req: Request, _id: string) => {
  await revokeRefreshTokenById(
    _id,
    req.socket.remoteAddress || '0.0.0.0',
    req.headers[USER_AGENT] || UNKNOWN
  )
}

export const signUp = async (
  req: Request,
  res: Response,
  successRedirect: string,
  newUser?: iNewUser
) => {
  //TODO: Hash Password  
  const count = await User.countDocuments()
  let groups: string[] = []
  if (count === 0) {
    groups = ['admin']
  }


  let transfercode = _generateTransfercode();
  while (await _isTransfercodeExisting(transfercode)) {
    transfercode = _generateTransfercode();
  }

  const user = await User.create({
    transfercode: _formatTransfercode(transfercode),
    ...newUser,
    password: newUser?.password, //TODO: HASH PASSWORD
    groups,
  })

  await signIn(req, res, successRedirect, user.transfercode, newUser?.password)
}

export const signIn = async (
  req: Request,
  res: Response,
  successRedirect: string,
  transfercode: string,
  password?: string
) => {
  const user = await User.findOne({ transfercode: transfercode })
  if (password || user.password) {
    //TODO: check user password to give more access rights with hash
    if (password !== user.password) {
      throw new GraphQLError(
        'User is not authenticated, more access function not done now',
        {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        }
      )
    }
  }

  if (!transfercode || !user) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }

  const refreshTokenDb = await generateRefreshToken(
    user.id,
    req.socket.remoteAddress || '0.0.0.0',
    req.headers[USER_AGENT] || UNKNOWN
  )

  const userPayload: JwtUserPayloadInterface = {
    token: refreshTokenDb.token,
  }

  _createTokensAndResponse(res, userPayload)

  if (user) {
    //We do a redirect after login so the client does not cache the login page datas
    res.redirect(302, process.env.CLIENT_URL + successRedirect)
  }
}

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies[jwtRefreshCookieName]
  if (!refreshToken) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }

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
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }
}

const _clearTokensAndResponse = (res: Response) => {
  res.setHeader(AUTHORIZATION, `${BEARER}`).cookie(jwtRefreshCookieName, '', {
    maxAge: 0,
    ...cookieOptions,
  })
}

const _createTokensAndResponse = async (
  res: Response,
  userPayload: JwtUserPayloadInterface
) => {
  const token = jwt.sign(userPayload, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpiry,
    issuer: process.env.SERVER_URL || 'https://karte.localhost:5001',
    audience: process.env.CLIENT_URL || 'https://karte.localhost',
    jwtid: randomTokenString(),
  })
  const refreshToken = jwt.sign(userPayload, jwtRefreshKey, {
    algorithm: 'HS256',
    expiresIn: jwtRefreshExpiry,
    issuer: process.env.SERVER_URL || 'https://karte.localhost:5001',
    audience: process.env.CLIENT_URL || 'https://karte.localhost',
    jwtid: randomTokenString(),
  })

  res
    .setHeader(AUTHORIZATION, `${BEARER} ${token}`)
    .cookie(jwtRefreshCookieName, refreshToken, {
      maxAge: jwtRefreshExpiry * 1000,
      ...cookieOptions,
    })
}

const _isTransfercodeExisting = async (transfercode: number) => {
  const user = await User.findOne({ transfercode: _formatTransfercode(transfercode) });
  return user !== null;
}

const _generateTransfercode = () => {
  return Math.floor(Math.random() * 999999); // Generates a random number between 0 and 999999
}

const _formatTransfercode = (transfercode: number) => {
  return '000000'.substring(String(transfercode).length) + transfercode;
}
