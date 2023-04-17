import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import { CookieOptions, Request, Response } from 'express'

import {
  getTokenUser,
  generateRefreshToken,
  refreshRefreshToken,
  revokeRefreshToken,
} from '../services/token'
import User, { iUser } from '../models/user'
import { iNewUser } from '../resolvers/user'
import {
  AUTHORIZATION,
  BEARER,
} from '../lib/const'

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

//TODO: API for get all refresh tokens which are not revoked from user with ip and the possability to delete revoke them
//TODO: no refresh token should be used twice or create an info for the user -> maybe he wants to revoke them all
//TODO: if ip address of user changes, info for the user -> maybe he wants to revoke them all

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
        req.socket.remoteAddress || '0.0.0.0'
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
  newUser?: iNewUser
) => {
  const count = ((await User.countDocuments()) + 1).toString()
  const user = await User.create({
    transfercode: '0000'.substring(String(count).length) + count,
    ...newUser,
    password: newUser?.password, //TODO: HASH PASSWORD
  })

  await signIn(req, res, user.transfercode, newUser?.password)
}

export const signIn = async (
  req: Request,
  res: Response,
  transferCode: string,
  password?: string
) => {
  const user = await User.findOne({ transfercode: transferCode })
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

  if (!transferCode || !user) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }

  const refreshTokenDb = await generateRefreshToken(
    user.id,
    req.socket.remoteAddress || '0.0.0.0'
  )

  const userPayload: JwtUserPayloadInterface = {
    token: refreshTokenDb.token,
  }

  _createTokensAndResponse(res, userPayload)
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
      req.socket.remoteAddress || '0.0.0.0'
    )
    const newUserPayload: JwtUserPayloadInterface = {
      token: newRefreshTokenDb.token,
    }

    _createTokensAndResponse(res, newUserPayload)
    return newUserPayload
  } catch (error) {
    console.error(error);
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }
}

const _clearTokensAndResponse = (res: Response) => {
  res
    .setHeader(AUTHORIZATION, `${BEARER}`)
    .cookie(jwtRefreshCookieName, '', {
      maxAge: 0,
      ...cookieOptions
    })
}

const _createTokensAndResponse = async (
  res: Response,
  userPayload: JwtUserPayloadInterface
) => {
  //TODO: Set all jwt standard claims
  const token = jwt.sign(userPayload, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpiry,
  })
  const refreshToken = jwt.sign(userPayload, jwtRefreshKey, {
    algorithm: 'HS256',
    expiresIn: jwtRefreshExpiry,
  })

  res
    .setHeader(AUTHORIZATION, `${BEARER} ${token}`)
    .cookie(jwtRefreshCookieName, refreshToken, {
      maxAge: jwtRefreshExpiry * 1000,
      ...cookieOptions
    })
}
