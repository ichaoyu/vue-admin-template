<template>
  <el-header class="layout-header">
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.meta?.title || item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-tooltip :content="themeStore.isDark ? '切换浅色主题' : '切换深色主题'" placement="bottom">
        <el-button circle @click="toggleTheme">
          <el-icon v-if="themeStore.isDark"><Sunny /></el-icon>
          <el-icon v-else><Moon /></el-icon>
        </el-button>
      </el-tooltip>
      <!-- 通知图标 -->
      <el-dropdown trigger="click" class="notification-dropdown-wrapper" @visible-change="handleDropdownVisible">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notification-badge">
          <el-button circle :class="{ 'has-unread': unreadCount > 0 }">
            <el-icon><Bell /></el-icon>
          </el-button>
        </el-badge>
        <template #dropdown>
          <div class="notification-dropdown">
            <div class="notification-header">
              <h3 class="notification-title">通知</h3>
              <el-button size="small" type="primary" text @click.stop="handleMarkAllRead" :disabled="unreadCount === 0">
                全部标记已读
              </el-button>
            </div>
            <el-dropdown-menu class="notification-menu">
              <el-dropdown-item
                v-for="item in unreadNotifications"
                :key="item.id"
                :class="['notification-item', 'unread']"
                @click="handleNotificationClick(item)"
              >
                <div class="notification-content">
                  <div class="notification-top">
                    <el-tag size="small" :type="getNotificationType(item.type)" effect="plain" class="notification-tag">
                      {{ getNotificationLabel(item.type) }}
                    </el-tag>
                    <span class="notification-item-title">{{ item.title }}</span>
                    <el-badge class="unread-badge" :value="''" />
                  </div>
                  <div class="notification-preview">{{ item.content }}</div>
                  <div class="notification-time">{{ formatTime(item.sendTime) }}</div>
                </div>
              </el-dropdown-item>
              <el-dropdown-item v-if="unreadNotifications.length === 0" class="notification-empty">
                <div class="empty-content">
                  <el-empty description="暂无未读通知" :image-size="80" />
                </div>
              </el-dropdown-item>
              <el-dropdown-item divided class="notification-footer">
                <el-button size="small" type="primary" text @click="handleViewAll">查看所有消息</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </template>
      </el-dropdown>
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userStore.userInfo?.avatar">
            {{ (userStore.userInfo?.nickName || userStore.userInfo?.userName || 'U').charAt(0).toUpperCase() }}
          </el-avatar>
          <span class="user-name">{{ userStore.userInfo?.nickName || userStore.userInfo?.userName || '用户' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">系统设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useThemeStore } from '@/store/theme'
import { useNotificationStore } from '@/store/notification'
import { logoutAPI } from '@/api/auth'
import { getNotificationType, getNotificationLabel } from '@/utils/notification'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

// #region 通知相关

const unreadCount = computed(() => notificationStore.getUnreadCount)
const unreadNotifications = computed(() => notificationStore.getUnreadNotifications.slice(0, 5))

const breadcrumbs = computed(() => {
  return route.matched.filter((item) => item.meta?.title)
})

const loadNotifications = async () => {
  await Promise.all([notificationStore.fetchNotifications({ pageSize: 10 }), notificationStore.fetchUnreadCount()])
}

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

const handleViewAll = () => {
  router.push('/system/notification')
}

const handleNotificationClick = async (item) => {
  try {
    await notificationStore.markAsRead(item.id)
  } catch (error) {
    console.error('标记已读失败:', error)
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return dayjs(timestamp).format('MM-DD HH:mm')
}

// #endregion

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/system/settings')
      break
    case 'logout':
      try {
        await logoutAPI()
      } catch (error) {
        console.error('退出登录失败:', error)
      }
      userStore.logout()
      router.push('/login')
      break
  }
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.user-info {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  outline: none;
}

.user-info:focus {
  outline: none;
}

.user-name {
  font-size: 14px;
  color: #333;
}

/* 通知相关样式 */
.notification-dropdown-wrapper {
  margin-right: 8px;
}

.notification-badge {
  position: relative;
}

.notification-badge .el-badge__content {
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  padding: 0 4px;
}

.notification-badge .has-unread {
  color: #409eff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.notification-dropdown {
  min-width: 360px;
  max-height: 450px;
  overflow-y: auto;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  background-color: #fff;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f9f9f9;
  border-radius: 6px 6px 0 0;
}

.notification-header .notification-title {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  margin: 0;
  line-height: 1.4;
}

.notification-header .el-button {
  font-size: 12px;
  padding: 0;
  height: 24px;
  line-height: 24px;
  color: #409eff;
}

.notification-header .el-button:hover {
  color: #66b1ff;
}

.notification-header .el-button:disabled {
  color: #c0c4cc;
}

.notification-menu {
  padding: 0;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
  margin: 0;
  border-radius: 0;
  position: relative;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-item.unread {
  background-color: #f0f9ff;
}

.notification-content {
  width: 100%;
}

.notification-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.notification-top .el-tag {
  flex-shrink: 0;
  font-size: 11px;
  height: 20px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 2px;
  font-weight: 500;
}

.notification-item-title {
  flex: 1;
  font-size: 13px;
  color: #303133;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.notification-preview {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  flex-shrink: 0;
  margin-left: 4px;
}

.unread-badge .el-badge__content {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  min-width: 6px;
  padding: 0;
  background-color: #409eff;
  box-shadow: 0 0 0 2px rgb(64 158 255 / 20%);
  animation: pulse 2s infinite;
}

.notification-time {
  font-size: 11px;
  color: #909399;
  line-height: 1.3;
}

.notification-empty {
  padding: 32px 16px;
  text-align: center;
  margin: 0;
}

.empty-content {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-footer {
  text-align: center;
  padding: 10px 16px;
  margin: 0;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
  border-radius: 0 0 6px 6px;
}

.notification-footer .el-button {
  font-size: 12px;
  padding: 0;
  height: 24px;
  line-height: 24px;
  color: #409eff;
  font-weight: 500;
}

.notification-footer .el-button:hover {
  color: #66b1ff;
}

/* 滚动条样式 */
.notification-dropdown::-webkit-scrollbar {
  width: 4px;
}

.notification-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.notification-dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.notification-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式调整 */
@media (width <= 768px) {
  .notification-dropdown {
    min-width: 300px;
  }
}
</style>
