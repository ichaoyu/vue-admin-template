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
      <!-- 通知铃铛 -->
      <NotificationBell />
      <!-- 新通知弹窗提醒 -->
      <NotificationToast />
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
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useThemeStore } from '@/store/theme'
import { useNotificationStore } from '@/store/notification'
import { logoutAPI } from '@/api/auth'
import { NotificationBell, NotificationToast } from '@/components/Notification'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const notificationStore = useNotificationStore()

const breadcrumbs = computed(() => {
  return route.matched.filter((item) => item.meta?.title)
})

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
      // 断开 WebSocket
      notificationStore.disconnectWebSocket()
      await userStore.logout()
      router.push('/login')
      break
  }
}

onMounted(() => {
  // 初始化通知数据（加载未读计数 + 最近通知 + WebSocket 连接）
  notificationStore.initNotifications()
})

onUnmounted(() => {
  notificationStore.disconnectWebSocket()
})
</script>

<style scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: var(--el-bg-color, #fff);
  border-bottom: 1px solid var(--el-border-color-lighter, #e8e8e8);
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
  color: var(--el-text-color-primary, #333);
}
</style>
