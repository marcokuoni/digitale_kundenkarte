import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import type { IncomingMessage, ServerResponse } from 'http'
import crypto from 'crypto'

import User from '../models/user'
import RefreshToken from '../models/refreshToken'

const jwtKey = process.env.JWT_KEY as Jwt.Secret
const jwtRefreshKey = process.env.JWT_REFRESH_KEY as Jwt.Secret
const jwtExpiry = process.env.JWT_EXPIRES_IN
const jwtRefreshExpiry = process.env.JWT_REFRESH_EXPIRES_IN
const jwtRefreshCookieName =
  process.env.JWT_REFRESH_COOKIE_NAME || 'refresh_token'
const AUTHORIZATION = 'Authorization'
const BEARER = 'Bearer'
const SET_COOKIE = 'Set-Cookie'
const COOKIE_DEFAULT_SETTINGS = 'HttpOnly; SameSite=Strict; Secure;'

export interface JwtUserPayloadInterface {
  id: string
}

export const verifyTokenAndGetUser = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const refreshToken = _getCookies(req)[jwtRefreshCookieName]
  let token = req.headers[AUTHORIZATION] as string

  if (token && token.indexOf(`${BEARER} `) >= 0) {
    token = token.split(' ')[1]
  }

  let user: JwtUserPayloadInterface | null = null
  try {
    user = jwt.verify(token, jwtKey) as JwtUserPayloadInterface
  } catch (e) {
    if (!refreshToken && e instanceof jwt.JsonWebTokenError) {
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

      _createTokensAndResponse(req, res, userPayload)
    } catch (error) {
      throw new GraphQLError('User is not authenticated', {
        extensions: {
          code: 'BAD_REQUEST',
          http: { status: 400 },
        },
      })
    }
  }
  return user
}


//TODO: API for revoke refresh token
export const _revokeRefreshToken = async (token: string, ipAddress: string) => {
    const refreshToken = await _getRefreshToken(token)
  
    // revoke token and save
    refreshToken.revoked = Date.now()
    refreshToken.revokedByIp = ipAddress
    await refreshToken.save()
  }
  
  //TODO: API for get all refresh tokens from user
export const _getRefreshTokens = async (userId: string) => {
    // return refresh tokens for user
    const refreshTokens = await RefreshToken.find({ user: userId })
    return refreshTokens
  }

export const singUp = async (
    req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const user = await User.create({})

  const userPayload: JwtUserPayloadInterface = {
    id: user._id,
  }

  _createTokensAndResponse(req, res, userPayload, true)
}

export const signIn = async (
    req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  transferCode: string
) => {
  const user = await User.findOne({ transfercode: transferCode })

  if (!transferCode || !user) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }

  const userPayload: JwtUserPayloadInterface = {
    id: user._id,
  }

  _createTokensAndResponse(req, res, userPayload, true)
}

export const refresh = (
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
    const refreshTokenToken = jwt.verify(
      refreshToken,
      jwtRefreshKey
    ) as JwtUserPayloadInterface
    const refreshTokenDb = await _getRefreshToken(refreshTokenToken)
    const { user } = refreshTokenDb
    const userPayload: JwtUserPayloadInterface = {
        id: user.id,
    }

    _createTokensAndResponse(req, res, userPayload, refreshTokenToken)
  } catch (error) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }
}

const _createTokensAndResponse = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  userPayload: JwtUserPayloadInterface,
  refreshTokenToken = '',
  newSession = false
) => {
  const token = jwt.sign(userPayload, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpiry,
  })
  //TODO: get IP from request
  let refreshTokenDb = null
  if (newSession) {
    refreshTokenDb = await _generateRefreshToken(userPayload.id, '0.0.0.0')
  } else {
    refreshTokenDb = await _refreshRefreshToken(refreshTokenToken, '0.0.0.0')
  }
  const refreshToken = jwt.sign(refreshTokenDb.token, jwtRefreshKey, {
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

const _refreshRefreshToken = async (token: string, ipAddress: string) => {
  const refreshToken = await _getRefreshToken(token)
  const { user } = refreshToken

  // replace old refresh token with a new one and save
  const newRefreshToken = _generateRefreshToken(user.id, ipAddress)
  refreshToken.revoked = Date.now()
  refreshToken.revokedByIp = ipAddress
  refreshToken.replacedByToken = newRefreshToken.token
  await refreshToken.save()

  // return basic details and tokens
  return newRefreshToken
}

const _getRefreshToken = (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate('user')
  if (!refreshToken || !(!refreshToken.revoked && !refreshToken.isExpired)) throw 'Invalid token'
  return refreshToken
}

const _generateRefreshToken = async (userId: string, ipAddress: string) => {
  // create a refresh token that expires in 7 days
  return await RefreshToken.create({
    user: userId,
    token: _randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  })
}

const _randomTokenString = () => {
  return crypto.randomBytes(40).toString('hex')
}
