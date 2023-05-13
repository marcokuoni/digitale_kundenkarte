import { MAIL_TEMPLATES, USER_ROLES } from '../lib/const'
import ipBlock from '../models/ipBlock'
import { iNewUser, iUpdateUser } from '../models/user'
import User from '../models/user'
import { ServerContext } from '../server_types'
import {
  checkAccessRights,
  checkRefreshTokenExisting,
  resetPassword,
  revokeRefreshTokenManualy,
  sendValidationMail,
  setNewPassword,
  signIn,
  signOut,
  signUp,
  validateEmail,
} from '../services/auth'
import { addStamp, honourCardFrom } from '../services/card'
import { sendMailWithTemplate } from '../services/mail'
import { generateUrlToken, getPaylodFromUrlToken } from '../services/urlToken'

export const Mutation = {
  async updateUser(
    root: never,
    { _id, name, email, newsletter, password }: { _id: string } & iUpdateUser
  ) {
    const values: iUpdateUser = {
      name,
      email,
      newsletter,
    }
    if (password) {
      values.password = password
      values.passwordChangedAt = new Date()
    }

    return await User.findOneAndUpdate({ _id }, values, { new: true })
  },
  async signIn(
    root: never,
    {
      transfercode,
      password,
      successRedirect,
    }: {
      transfercode: string
      password: string
      successRedirect: string
    },
    context: ServerContext
  ) {
    await signIn(
      context.req,
      context.res,
      successRedirect,
      transfercode,
      password
    )
    return true
  },
  async passwordReset(
    root: never,
    {
      email,
    }: {
      email: string
    }
  ) {
    await resetPassword(email)
    return true
  },
  async resetPassword(
    root: never,
    {
      token,
      password,
    }: {
      token: string
      password: string
    }
  ) {
    await setNewPassword(token, password)
    return true
  },
  async sendValidationMail(root: never, args: never, context: ServerContext) {
    checkAccessRights(context.user)
    if (context?.user?.email) {
      await sendValidationMail(context.user.email)
    }
    return true
  },
  async validateEmail(
    root: never,
    {
      token,
    }: {
      token: string
    }
  ) {
    await validateEmail(token)
    return true
  },
  async signUp(
    root: never,
    newUser: iNewUser & { successRedirect?: string },
    context: ServerContext
  ) {
    const successRedirect = newUser.successRedirect
    delete newUser.successRedirect
    await signUp(context.req, context.res, successRedirect || '/', newUser)
    return true
  },
  async refresh(root: never, args: never, context: ServerContext) {
    // refresh gets already called in the context middleware (verifyTokenAndGetUser)
    checkRefreshTokenExisting(context.req)
    return true
  },
  async signOut(root: never, args: never, context: ServerContext) {
    await signOut(context.req, context.res)
    return true
  },
  async revokeRefreshToken(
    root: never,
    { _id }: { _id: string },
    context: ServerContext
  ) {
    await revokeRefreshTokenManualy(context.req, _id)
    return true
  },
  async deleteIpBlock(
    root: never,
    { _id }: { _id: string },
    context: ServerContext
  ) {
    checkAccessRights(context.user, [USER_ROLES.ADMIN])
    await ipBlock.deleteOne({ _id })
    return true
  },
  async addIpBlock(
    root: never,
    { ip, blockedUntil }: { ip: string; blockedUntil: Date },
    context: ServerContext
  ) {
    checkAccessRights(context.user, [USER_ROLES.ADMIN])
    await ipBlock.create({ ip, blockedUntil })
    return true
  },
  generateUrlToken(
    root: never,
    {
      validUntil,
      blockForMinutes,
    }: { validUntil: Date; blockForMinutes: number },
    context: ServerContext
  ) {
    checkAccessRights(context.user, [USER_ROLES.EMPLOYEE])
    return generateUrlToken(validUntil, blockForMinutes)
  },
  async addStamp(
    root: never,
    { urlToken }: { urlToken: string },
    context: ServerContext
  ) {
    checkAccessRights(context.user)
    if (context.user) {
      const payload = getPaylodFromUrlToken(urlToken)
      return await addStamp(payload, context.user)
    }
    return false
  },
  async honourCardFrom(
    root: never,
    { transfercode }: { transfercode: string },
    context: ServerContext
  ) {
    checkAccessRights(context.user, [USER_ROLES.EMPLOYEE])
    return await honourCardFrom(transfercode)
  },
  async updateUserRoles(
    root: never,
    { _id, userRoles }: { _id: string; userRoles: USER_ROLES[] },
    context: ServerContext
  ) {
    checkAccessRights(context.user, [USER_ROLES.ADMIN])
    return await User.findOneAndUpdate({ _id }, { userRoles }, { new: true })
  },
}
