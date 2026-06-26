<template>
  <el-dropdown trigger="click" class="notification-bell-wrapper" @visible-change="handleDropdownVisible">
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notification-badge">
      <el-button circle :class="{ 'has-unread': unreadCount > 0 }">
        <el-icon><Bell /></el-icon>
      </el-button>
    </el-badge>
    <template #dropdown>
      <NotificationDropdown
        :notifications="unreadNotifications"
        :unread-count="unreadCount"
        @mark-all-read="handleMarkAllRead"
        @notification-click="handleNotificationClick"
        @view-all="handleViewAll"
      />
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell } from '@element-plus/icons-vue'
import { useNotificationStore } from '@/store/notification'
import NotificationDropdown from './NotificationDropdown.vue'

const router = useRouter()
const notificationStore = useNotificationStore()

const unreadCount = computed(() => notificationStore.getUnreadCount)
const unreadNotifications = computed(() => notificationStore.getUnreadNotifications.slice(0, 5))

const handleDropdownVisible = async (visible) => {
  if (visible) {
    await notificationStore.fetchNotifications({ pageSize: 10 })
  }
}

const handleMarkAllRead = async () => {
  try {
    await notificationStore.markAllAsRead()
  } catch (error) {
    console.error('全部标记已读失败:', error)
  }
}

const handleNotificationClick = async (item) => {
  try {
    await notificationStore.markAsRead(item.id)
  } catch (error) {
    console.error('标记已读失败:', error)
  }
}

const handleViewAll = () => {
  router.push('/system/notification')
}
</script>

<style scoped>
.notification-bell-wrapper {
  margin-right: 8px;
}

.notification-badge {
  position: relative;
}

.notification-badge :deep(.el-badge__content) {
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 4px;
}

.has-unread {
  color: var(--el-color-primary, #409eff);
  animation: bell-pulse 2s ease-in-out infinite;
}

@keyframes bell-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}
</style>
