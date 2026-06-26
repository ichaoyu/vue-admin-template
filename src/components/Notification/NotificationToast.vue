<template>
  <Transition name="notification-toast">
    <div v-if="visible" class="notification-toast" @click="handleClick">
      <div class="toast-icon">
        <el-icon :size="20">
          <Bell />
        </el-icon>
      </div>
      <div class="toast-content">
        <div class="toast-title">{{ notification?.title }}</div>
        <div class="toast-message">{{ truncatedContent }}</div>
      </div>
      <el-icon class="toast-close" @click.stop="close">
        <Close />
      </el-icon>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Close } from '@element-plus/icons-vue'
import { useNotificationStore } from '@/store/notification'
import { truncateContent } from '@/utils/notification'

const router = useRouter()
const notificationStore = useNotificationStore()

const visible = ref(false)
const notification = ref(null)
let autoCloseTimer = null

// 监听新通知
watch(
  () => notificationStore.newNotification,
  (newNotification) => {
    if (newNotification) {
      show(newNotification)
    }
  }
)

function show(notificationData) {
  notification.value = notificationData
  visible.value = true

  // 清除之前的自动关闭定时器
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }

  // 3 秒后自动关闭
  autoCloseTimer = setTimeout(() => {
    close()
  }, 3000)
}

function close() {
  visible.value = false
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  // 清除 store 中的新通知标记
  notificationStore.clearNewNotification()
}

function handleClick() {
  if (notification.value) {
    // 标记已读
    notificationStore.markAsRead(notification.value.id)
    // 跳转到通知列表
    router.push('/system/notification')
  }
  close()
}

const truncatedContent = ref('')
watch(
  () => notification.value,
  (val) => {
    truncatedContent.value = truncateContent(val?.content, 40)
  }
)

onBeforeUnmount(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>

<style scoped>
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  min-width: 320px;
  max-width: 400px;
  border-radius: 8px;
  background-color: var(--el-bg-color, #fff);
  box-shadow:
    0 6px 16px rgb(0 0 0 / 8%),
    0 3px 6px rgb(0 0 0 / 6%);
  border-left: 3px solid var(--el-color-primary, #409eff);
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-toast:hover {
  box-shadow:
    0 8px 24px rgb(0 0 0 / 12%),
    0 4px 8px rgb(0 0 0 / 8%);
  transform: translateY(-1px);
}

.toast-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--el-color-primary-light-9, #ecf5ff);
  color: var(--el-color-primary, #409eff);
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary, #303133);
  line-height: 1.4;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toast-message {
  font-size: 12px;
  color: var(--el-text-color-regular, #606266);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toast-close {
  flex-shrink: 0;
  font-size: 14px;
  color: var(--el-text-color-placeholder, #c0c4cc);
  cursor: pointer;
  transition: color 0.2s;
}

.toast-close:hover {
  color: var(--el-text-color-secondary, #909399);
}

/* 过渡动画 */
.notification-toast-enter-active {
  animation: toast-in 0.3s ease-out;
}

.notification-toast-leave-active {
  animation: toast-out 0.2s ease-in;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* 深色主题适配 */
:root.dark .notification-toast {
  border-left-color: var(--el-color-primary);
}
</style>
