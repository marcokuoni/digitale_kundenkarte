import type { User } from '../codegen'
import { USER_ROLES } from '../lib/const'

export const checkAccessRights = (
  user?: User,
  requiredGroups: string[] = []
) => {
  if (!user) {
    return false
  }

  if (user.userRoles.includes(USER_ROLES.ADMIN)) {
    return true
  }

  return requiredGroups.length > 0
    ? requiredGroups.every((userRole) => user.userRoles.includes(userRole))
    : true
}
