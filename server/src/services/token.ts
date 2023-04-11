import crypto from 'crypto'

import User from '../models/user'
import RefreshToken, { iRefreshToken } from '../models/refreshToken'

const jwtRefreshExpiry = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '0')

export const revokeRefreshToken = async (token: string, ipAddress: string) => {
  const refreshToken = await getRefreshToken(token)

  refreshToken.revoked = Date.now()
  refreshToken.revokedByIp = ipAddress
  await refreshToken.save()
}

export const refreshRefreshToken = async (
  token: string,
  ipAddress: string
) => {
  const refreshToken = await getRefreshToken(token)
  const { user } = refreshToken

  const newRefreshToken = await generateRefreshToken(user.id, ipAddress)
  refreshToken.revoked = Date.now()
  refreshToken.revokedByIp = ipAddress
  refreshToken.replacedByToken = newRefreshToken.token
  await refreshToken.save()

  return newRefreshToken
}

export const getTokenUser = async (token: string) => {
  return await User.findOne({ token })
}

export const getRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate('user')
  if (!refreshToken || !(!refreshToken.revoked && !refreshToken.isExpired))
    throw 'Invalid token'
  return refreshToken
}

export const generateRefreshToken = async (
  userId: string,
  ipAddress: string
): Promise<iRefreshToken> => {
  return await RefreshToken.create({
    user: userId,
    token: _randomTokenString(),
    expires: new Date(Date.now() + jwtRefreshExpiry),
    createdByIp: ipAddress,
  })
}

const _randomTokenString = () => {
  return crypto.randomBytes(40).toString('hex')
}
