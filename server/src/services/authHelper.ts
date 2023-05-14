import * as jwt from 'jsonwebtoken'
import type Jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { AUTHORIZATION, BEARER, USER_ROLES } from '../lib/const'
import { throwUnauthenticated } from '../lib/exceptions'
import { iUser } from '../models/user'
import { JwtUserPayloadInterface, refresh } from './auth'
import { getTokenUser } from './authToken'

const jwtKey = process.env.JWT_KEY as Jwt.Secret
const jwtRefreshCookieName =
  process.env.JWT_REFRESH_COOKIE_NAME || 'refresh_token'

export const checkAccessRights = (
    user?: iUser,
    requiredGroups: string[] = [],
    ownerId = ''
  ) => {
    let hasAccess = false
    if (!user) {
      throwUnauthenticated('User is not authenticated')
    } else {
      if (user.userRoles.includes(USER_ROLES.ADMIN)) {
        return true
      }
  
      if(requiredGroups.length > 0) {
        hasAccess = requiredGroups.every((userRole) => user.userRoles.includes(userRole))
      } else {
        hasAccess = true
      }
  
      if(ownerId) {
        hasAccess = hasAccess && user._id === ownerId
      }
    }
    return hasAccess
  }
  
  export const verifyTokenAndGetUser = async (req: Request, res: Response) => {
    let jwtAccessToken = req.headers[AUTHORIZATION] as string
  
    if (jwtAccessToken && jwtAccessToken.indexOf(`${BEARER} `) >= 0) {
      jwtAccessToken = jwtAccessToken.split(' ')[1]
    }
    let userPayload: JwtUserPayloadInterface | undefined = undefined
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