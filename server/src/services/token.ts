import { randomTokenString } from '../lib/helpers'
import RefreshToken, { iRefreshToken } from '../models/refreshToken'

const jwtRefreshExpiry = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '0')

export const revokeRefreshToken = async (token: string, ipAddress: string) => {
  console.log('%ctoken.ts line:8 token', 'color: #007acc;', token)
  const refreshToken = await getRefreshToken(token)
  console.log(
    '%ctoken.ts line:10 refreshToken',
    'color: #007acc;',
    refreshToken
  )
  refreshToken.revoked = Date.now()
  refreshToken.revokedByIp = ipAddress

  await refreshToken.save()
}

export const refreshRefreshToken = async (token: string, ipAddress: string) => {
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
  const refreshToken = await RefreshToken.findOne({ token }).populate('user')
  return refreshToken.user
}

export const getRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate('user')
  if (!refreshToken || refreshToken.revoked || refreshToken.isExpired) {
    console.error('Invalid token')
    return null
  }
  return refreshToken
}

export const generateRefreshToken = async (
  userId: string,
  ipAddress: string
): Promise<iRefreshToken> => {
  return await RefreshToken.create({
    user: userId,
    token: randomTokenString(),
    expires: new Date(Date.now() + jwtRefreshExpiry),
    createdByIp: ipAddress,
  })
}
