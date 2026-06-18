import { useUserStore } from '@/store/user'

// 超级管理员角色标识
const SUPER_ADMIN_ROLE = 'admin'

const hasPermission = (permissions, value) => {
  if (!value) return true

  const permissionValues = Array.isArray(value) ? value : [value]

  if (permissionValues.length === 0) return true

  return permissions.some((perm) => permissionValues.includes(perm))
}

export const permission = {
  mounted(el, binding) {
    const { value } = binding
    const userStore = useUserStore()
    const permissions = userStore.permissions || []
    const roles = userStore.roles || []

    // 超级管理员自动拥有所有权限
    if (roles.includes(SUPER_ADMIN_ROLE)) {
      return
    }

    if (value && value.length > 0) {
      const hasPerm = hasPermission(permissions, value)

      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  },
}

export default permission
