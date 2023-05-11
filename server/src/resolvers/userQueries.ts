import { USER_ROLES } from '../lib/const'
import { ServerContext } from '../server_types'
import { checkAccessRights } from '../services/auth'
import User from '../models/user'
import ipBlock from '../models/ipBlock'

export const Query = {
    async getUsersWithPassword(root: never, args: never, context: ServerContext) {
      checkAccessRights(context.user, [USER_ROLES.ADMIN])
      return await User.find({password: { $exists: true, $regex: /\S/ }})
    },
    async getCurrentUser(root: never, args: never, context: ServerContext) {
      checkAccessRights(context.user)
      return context.user
    },
    async getActiveRefreshTokens(
      root: never,
      args: never,
      context: ServerContext
    ) {
      checkAccessRights(context.user)
      if (context.user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return await RefreshToken.find({
          user: context.user._id,
          revoked: { $exists: false },
        }).exec()
      }
      return []
    },
    async getIpBlocks(root: never, args: never, context: ServerContext) {
      checkAccessRights(context.user, [USER_ROLES.ADMIN])
      return ipBlock.find()
    },
  }