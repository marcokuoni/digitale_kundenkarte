import { USER_ROLES } from '../lib/const'
import { ServerContext } from '../server_types'
import { checkAccessRights } from '../services/authHelper'
import User from '../models/user'
import ipBlock from '../models/ipBlock'
import { getActiveRefreshTokens } from '../services/authToken'

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
        return await getActiveRefreshTokens(context.user._id)
      }
      return []
    },
    async getIpBlocks(root: never, args: never, context: ServerContext) {
      checkAccessRights(context.user, [USER_ROLES.ADMIN])
      return await ipBlock.find()
    },
  }