<template>
  <slot v-if="hasPermission" />
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

defineOptions({
  name: 'Permission',
})

// 超级管理员角色标识
const SUPER_ADMIN_ROLE = 'admin'

const props = defineProps({
  perms: {
    type: [String, Array],
    default: '',
  },
})

const userStore = useUserStore()

const hasPermission = computed(() => {
  const { perms } = props
  const permissions = userStore.permissions || []
  const roles = userStore.roles || []

  // 超级管理员自动拥有所有权限
  if (roles.includes(SUPER_ADMIN_ROLE)) {
    return true
  }

  if (!perms) return true

  const permissionValues = Array.isArray(perms) ? perms : [perms]

  if (permissionValues.length === 0) return true

  return permissions.some((perm) => permissionValues.includes(perm))
})
</script>
