import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import { CookieOptions, Request, Response } from 'express'
import bcrypt from 'bcrypt'

import {
  getTokenUser,
  generateRefreshToken,
  refreshRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokenById,
} from '../services/token'
import User, { iNewUser, iUser } from '../models/user'
import {
  AUTHORIZATION,
  AUTH_TOKEN_SEPERATOR,
  BEARER,
  MAIL_TEMPLATES,
  UNKNOWN,
  USER_AGENT,
  USER_ROLES,
} from '../lib/const'
import { randomTokenString } from '../lib/helpers'
import { sendMailWithTemplate } from './mail'

const jwtKey = process.env.JWT_KEY as Jwt.Secret
const jwtRefreshKey = process.env.JWT_REFRESH_KEY as Jwt.Secret
const emailResetKey = process.env.EMAIL_RESET_SECRET as Jwt.Secret
const jwtExpiry = parseInt(process.env.JWT_EXPIRES_IN || '0')
const jwtRefreshExpiry = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '0')
const jwtEmailResetExpiry = parseInt(process.env.EMAIL_RESET_EXPIRES_IN || '0')
const jwtRefreshCookieName =
  process.env.JWT_REFRESH_COOKIE_NAME || 'refresh_token'
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
}
const saltRounds = parseInt(process.env.SALT_ROUNDS || '10')

export interface JwtUserPayloadInterface {
  token: string
}

interface ResetPasswordPayloadInerface {
  token: string
}

export const checkAccessRights = (
  user?: iUser,
  requiredGroups: string[] = []
) => {
  if (!user) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }

  if (user.userRoles.includes(USER_ROLES.ADMIN)) {
    return true
  }

  return requiredGroups.length > 0
    ? requiredGroups.every((userRole) => user.userRoles.includes(userRole))
    : true
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
  let password = newUser?.password
  const count = await User.countDocuments()
  let userRoles: string[] = []
  if (count === 0) {
    userRoles = [USER_ROLES.ADMIN]
    if (!password) {
      password = randomTokenString()
    }
  }

  let hash: string | null = null
  if (password) {
    hash = await bcrypt.hash(password, saltRounds)
  }

  let transfercode = _generateTransfercode()
  while (await _isTransfercodeExisting(transfercode)) {
    transfercode = _generateTransfercode()
  }

  const user = await User.create({
    transfercode: _formatTransfercode(transfercode),
    ...newUser,
    password: hash,
    passwordChangedAt: new Date(),
    userRoles,
  })

  await signIn(req, res, successRedirect, user.transfercode, password)
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
    const isMatch = password
      ? await bcrypt.compare(password, user.password)
      : false
    if (!isMatch) {
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
    throw new GraphQLError('login', {
      extensions: {
        code: 'LOGIN',
        http: {
          status: 302,
          headers: new Map([
            [
              'Location',
              `${process.env.CLIENT_URL}${successRedirect}${AUTH_TOKEN_SEPERATOR}${token}`,
            ],
          ]),
        },
      },
    })
  }
}

export const resetPassword = async (email: string) => {
  const user = await User.findOne({ email })
  let hasOldValidToken = false

  if (user) {
    if (user.passwordResetToken) {
      try {
        jwt.verify(
          user.passwordResetToken,
          emailResetKey
        ) as ResetPasswordPayloadInerface
        hasOldValidToken = true
      } catch (e) {
        console.error(e)
      }
    }

    const payload: ResetPasswordPayloadInerface = {
      token: user._id,
    }

    const resetToken = jwt.sign(payload, emailResetKey, {
      algorithm: 'HS256',
      expiresIn: jwtEmailResetExpiry,
      issuer: process.env.SERVER_URL || 'https://karte.localhost',
      audience: process.env.CLIENT_URL || 'https://karte.localhost',
      jwtid: randomTokenString(),
    })

    user.passwordResetToken = resetToken
    await user.save()

    await sendMailWithTemplate(
      user.email,
      MAIL_TEMPLATES.RESET_PASSWORD,
      {
        name: user.name,
        resetToken,
        hasOldValidToken,
      },      
    )
  }
}

export const setNewPassword = async (token: string, password: string) => {
  const payload = jwt.verify(
    token,
    emailResetKey
  ) as ResetPasswordPayloadInerface

  if (!payload.token) {
    throw new GraphQLError('Bad Token', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }

  const user = await User.findById(payload.token)

  if (!user || !user.passwordResetToken || user.passwordResetToken !== token) {
    throw new GraphQLError('Bad Token', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }

  user.password = await bcrypt.hash(password, saltRounds)
  user.passwordResetToken = undefined
  user.passwordChangedAt = new Date()

  await user.save()
}

export const checkRefreshTokenExisting = (req: Request) => {
  const refreshToken = req.cookies[jwtRefreshCookieName]
  if (!refreshToken) {
    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }
  return refreshToken
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

const _isTransfercodeExisting = async (transfercode: number) => {
  const user = await User.findOne({
    transfercode: _formatTransfercode(transfercode),
  })
  return user !== null
}

const _generateTransfercode = () => {
  return Math.floor(Math.random() * 999999) // Generates a random number between 0 and 999999
}

const _formatTransfercode = (transfercode: number) => {
  return '000000'.substring(String(transfercode).length) + transfercode
}
