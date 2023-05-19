import { USER_ROLES } from '../lib/const'
import ipBlock from '../models/ipBlock'
import { iUpdateUser } from '../models/user'
import User from '../models/user'
import { ServerContext } from '../server_types'
import {
  checkRefreshTokenExisting,
  revokeRefreshTokenManualy,
  signIn,
  signOut,
  signUp,
} from '../services/auth'
import { sendValidationMail, validateEmail } from '../services/authEmailValidation'
import { checkAccessRights } from '../services/authHelper'
import { resetPassword, setNewPassword } from '../services/authPasswordReset'
import { addStamp, honourCardFrom } from '../services/card'
import { generateUrlToken, getPaylodFromUrlToken } from '../services/stampToken'
import { resendTransfercode, updateUser } from '../services/user'

export const Mutation = {
  async updateUser(
    root: never,
    { _id, ...values }: { _id: string } & iUpdateUser,
    context: ServerContext
  ) {
    checkAccessRights(context.user, [], _id)

    if (context.user) {
      return await updateUser(_id, values, context.user)
    }
    return false
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
  async resendTransfercode(
    root: never,
    {
      email,
    }: {
      email: string
    }
  ) {
    await resendTransfercode(email)
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
    newUser: iUpdateUser & { successRedirect?: string },
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
    { ip, blockedUntil }: { ip: string; blockedUntil?: Date },
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
      if (payload) {
        return await addStamp(payload, context.user)
      }
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
