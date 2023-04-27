import type { User } from '../codegen'

export const checkAccessRights = (
  user?: User,
  requiredGroups: string[] = []
) => {
  if (!user) {
    return false
  }

  return requiredGroups.length > 0
    ? requiredGroups.every((userRole) => user.userRoles.includes(userRole))
    : true
}
