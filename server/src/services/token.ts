import { randomTokenString } from '../lib/helpers'
import RefreshToken, { iRefreshToken } from '../models/refreshToken'

const jwtRefreshExpiry = parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '0')

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
}

export const refreshRefreshToken = async (
  token: string,
  ipAddress: string,
  userAgent: string
) => {
  //TODO: if ip address of user changes, info for the user -> maybe he wants to revoke them all
  //TODO: no refresh token should be used twice create an info for the user
  // the refresh token will be null here if it was already used but no body will realize it at the moment just the refresh will fail
  const refreshToken = await getRefreshToken(token)
  const { user } = refreshToken

  const newRefreshToken = await generateRefreshToken(
    user.id,
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
    console.error('Invalid token')
    return null
  }
  return refreshToken
}

export const generateRefreshToken = async (
  userId: string,
  ipAddress: string,
  userAgent: string
): Promise<iRefreshToken> => {
  return await RefreshToken.create({
    user: userId,
    token: randomTokenString(),
    expires: new Date(Date.now() + jwtRefreshExpiry * 1000),
    createdByIp: ipAddress,
    createdByUserAgent: userAgent,
  })
}
