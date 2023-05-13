import { GraphQLError } from 'graphql'
import { randomTokenString } from '../lib/helpers'
import RefreshToken, { iRefreshToken } from '../models/refreshToken'
import User from '../models/user'
import { sendMailWithTemplate } from './mail'
import { MAIL_TEMPLATES } from '../lib/const'

const jwtRefreshExpiry = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '0')
const maxRefreshTokens = parseInt(process.env.MAX_REFRESH_TOKENS || '0')

export const revokeRefreshTokenById = async (
  _id: string,
  ipAddress: string,
  userAgent: string
) => {
  const refreshToken = await RefreshToken.findOne({ _id })
  await revokeRefreshToken(refreshToken.token, ipAddress, userAgent)
}

export const revokeRefreshToken = async (
  token: string,
  ipAddress: string,
  userAgent: string
) => {
  const refreshToken = await getRefreshToken(token)
  refreshToken.revoked = Date.now()
  refreshToken.revokedByIp = ipAddress
  refreshToken.revokedByUserAgent = userAgent

  await refreshToken.save()

  if (
    refreshToken.createdByIp !== ipAddress ||
    refreshToken.createdByUserAgent !== userAgent
  ) {
    await sendMailWithTemplate(
      refreshToken.user.email,
      MAIL_TEMPLATES.DIFFERENT_DEVICE,
      {
        name: refreshToken.user.name,
        ipAddress,
        userAgent,
      }
    )
  }
}

export const refreshRefreshToken = async (
  token: string,
  ipAddress: string,
  userAgent: string
) => {
  const refreshToken = await getRefreshToken(token)
  const { user } = refreshToken

  const newRefreshToken = await generateRefreshToken(
    user._id,
    ipAddress,
    userAgent
  )
  refreshToken.revoked = Date.now()
  refreshToken.revokedByIp = ipAddress
  refreshToken.revokedByUserAgent = userAgent
  refreshToken.replacedByToken = newRefreshToken.token
  await refreshToken.save()

  return newRefreshToken
}

export const getTokenUser = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate('user')
  return refreshToken.user
}

export const getRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate('user')
  if (!refreshToken || refreshToken.revoked || refreshToken.isExpired) {
    await sendMailWithTemplate(
      refreshToken.user.email,
      MAIL_TEMPLATES.TOKEN_USED_TWICE,
      {
        name: refreshToken.user.name,
      }
    )

    throw new GraphQLError('User is not authenticated', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }
  return refreshToken
}

export const generateRefreshToken = async (
  _id: string,
  ipAddress: string,
  userAgent: string
): Promise<iRefreshToken> => {
  const user = await User.findOne({ _id })
  if (!user) {
    throw new GraphQLError('User is not existing', {
      extensions: {
        code: 'BAD_REQUEST',
        http: { status: 400 },
      },
    })
  }
  
  const oldRefreshToken = await RefreshToken.findOne({
    createdByIp: ipAddress,
    createdByUserAgent: userAgent,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    user: _id,
  })

  if (!oldRefreshToken) {
    await sendMailWithTemplate(
      user.email,
      MAIL_TEMPLATES.CREATED_FROM_UNKNOWN_DEVICE,
      {
        name: user.name,
        ipAddress,
        userAgent,
      }
    )
  }

  const tokens = await getActiveRefreshTokens(user._id)
  if (tokens.length > maxRefreshTokens) {
    await sendMailWithTemplate(
      user.email,
      MAIL_TEMPLATES.MORE_THEN_ALLOWED_CONNECTED_DEVICES,
      {
        name: user.name,
      }
    )

    const oldestToken = tokens.sort(
      (a: iRefreshToken, b: iRefreshToken) => a.expires.getTime() - b.expires.getTime()
    )[0]
    await revokeRefreshToken(oldestToken.token, ipAddress, userAgent)
  }

  return await RefreshToken.create({
    user: _id,
    token: randomTokenString(),
    expires: new Date(Date.now() + jwtRefreshExpiry * 1000),
    createdByIp: ipAddress,
    createdByUserAgent: userAgent,
  })
}

export const getActiveRefreshTokens = async (_id: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return await RefreshToken.find({
    user: _id,
    revoked: { $exists: false },
  }).exec()
}
