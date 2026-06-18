import { useUserStore } from '@/store/user'

// 超级管理员角色标识
const SUPER_ADMIN_ROLE = 'admin'

/**
 * 判断用户是否拥有指定权限
 * @param {string|string[]} permission - 权限标识或权限数组
 * @returns {boolean} 是否拥有权限
 */
export const hasPermission = (permission) => {
  if (!permission) return true

  const userStore = useUserStore()
  const permissions = userStore.permissions || []
  const roles = userStore.roles || []

  // 超级管理员自动拥有所有权限
  if (roles.includes(SUPER_ADMIN_ROLE)) {
    return true
  }

  const permissionValues = Array.isArray(permission) ? permission : [permission]

  if (permissionValues.length === 0) return true

  return permissions.some((perm) => permissionValues.includes(perm))
}

/**
 * 判断用户是否拥有指定角色
 * @param {string|string[]} role - 角色标识或角色数组
 * @returns {boolean} 是否拥有角色
 */
export const hasRole = (role) => {
  if (!role) return true

  const userStore = useUserStore()
  const roles = userStore.roles || []

  const roleValues = Array.isArray(role) ? role : [role]

  if (roleValues.length === 0) return true

  return roles.some((r) => roleValues.includes(r))
}

export default {
  hasPermission,
  hasRole,
}
