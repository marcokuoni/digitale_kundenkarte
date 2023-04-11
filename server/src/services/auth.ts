import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { GraphQLError } from 'graphql'
import type { IncomingMessage, ServerResponse } from 'http'

import {
  getTokenUser,
  generateRefreshToken,
  refreshRefreshToken,
  revokeRefreshToken,
} from '../services/token'
import User from '../models/user'

const jwtKey = process.env.JWT_KEY as Jwt.Secret
const jwtRefreshKey = process.env.JWT_REFRESH_KEY as Jwt.Secret
const jwtExpiry = parseInt(process.env.JWT_EXPIRES_IN || '0')
const jwtRefreshExpiry = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '0')
const jwtRefreshCookieName =
  process.env.JWT_REFRESH_COOKIE_NAME || 'refresh_token'
const AUTHORIZATION = 'Authorization'
const BEARER = 'Bearer'
const SET_COOKIE = 'Set-Cookie'
const COOKIE_DEFAULT_SETTINGS = 'HttpOnly; SameSite=Strict; Secure;'

export interface JwtUserPayloadInterface {
  token: string
}

export const verifyTokenAndGetUser = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  let jwtAccessToken = req.headers[AUTHORIZATION] as string

  if (jwtAccessToken && jwtAccessToken.indexOf(`${BEARER} `) >= 0) {
    jwtAccessToken = jwtAccessToken.split(' ')[1]
  }

  let userPayload: JwtUserPayloadInterface | null = null
  try {
    userPayload = jwt.verify(jwtAccessToken, jwtKey) as JwtUserPayloadInterface
  } catch (e) {
    userPayload = await refresh(req, res)
  }

  if (userPayload) {
    const user = await getTokenUser(userPayload.token)
    return user
  } else {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }
}

//TODO: API for get all refresh tokens which are not revoked from user with ip and the possability to delete revoke them
//TODO: no refresh token should be used twice or create an info for the user -> maybe he wants to revoke them all
//TODO: if ip address of user changes, info for the user -> maybe he wants to revoke them all

export const logout = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const refreshToken = _getCookies(req)[jwtRefreshCookieName]
  if (refreshToken) {
    const userPayload = jwt.verify(
      refreshToken,
      jwtRefreshKey
    ) as JwtUserPayloadInterface
    await revokeRefreshToken(
      userPayload.token,
      req.socket.remoteAddress || '0.0.0.0'
    )
  }

  _clearTokensAndResponse(res)
}

export const signUp = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  password?: string
) => {
  const count = (await User.count() + 1).toString()
  const user = await User.create({
    transfercode: '0000'.substring(String(count).length) + count,
    password, //TODO: HASH PASSWORD
  })

  await signIn(req, res, user.transfercode)
}

export const signIn = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
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

export const refresh = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const refreshToken = _getCookies(req)[jwtRefreshCookieName]
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
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }
}

const _clearTokensAndResponse = (res: ServerResponse<IncomingMessage>) => {
  res
    .setHeader(
      SET_COOKIE,
      `${jwtRefreshCookieName}=; Max-Age=0; ${COOKIE_DEFAULT_SETTINGS}`
    )
    .setHeader(AUTHORIZATION, `${BEARER}`)
}

const _createTokensAndResponse = async (
  res: ServerResponse<IncomingMessage>,
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
    .setHeader(
      SET_COOKIE,
      `${jwtRefreshCookieName}=${refreshToken};${COOKIE_DEFAULT_SETTINGS}expires=${jwtRefreshExpiry}`
    )
    .setHeader(AUTHORIZATION, `${BEARER} ${token}`)
}

const _getCookies = function (request: IncomingMessage) {
  const cookies: {
    [key: string]: string
  } = {}
  request.headers &&
    request.headers.cookie &&
    request.headers.cookie.split(';').forEach(function (cookie) {
      const parts = cookie.match(/(.*?)=(.*)$/)
      const key = parts && parts[1].trim()
      if (key) {
        cookies[parts[1].trim()] = (parts[2] || '').trim()
      }
    })
  return cookies
}
