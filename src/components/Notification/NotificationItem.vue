<template>
  <div class="notification-item" :class="{ unread: notification.isRead === 0 }" @click="$emit('click', notification)">
    <!-- 未读指示器 -->
    <span v-if="notification.isRead === 0" class="unread-dot"></span>

    <div class="notification-content">
      <div class="notification-top">
        <el-tag size="small" :type="getNotificationType(notification.type)" effect="plain" class="notification-tag">
          {{ getNotificationLabel(notification.type) }}
        </el-tag>
        <span class="notification-item-title">{{ notification.title }}</span>
      </div>
      <div class="notification-preview">{{ truncatedContent }}</div>
      <div class="notification-time">{{ relativeTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getNotificationType, getNotificationLabel, truncateContent } from '@/utils/notification'
import dayjs from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTimePlugin)
dayjs.locale('zh-cn')

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const truncatedContent = computed(() => {
  return truncateContent(props.notification.content, 60)
})

const relativeTime = computed(() => {
  const time = props.notification.sendTime
  if (!time) return '-'

  const now = dayjs()
  const target = dayjs(time)
  const diffDays = now.diff(target, 'day')

  // 超过 7 天显示具体日期
  if (diffDays > 7) {
    return target.format('YYYY-MM-DD HH:mm')
  }

  // 超过 1 天显示"昨天"等
  if (diffDays >= 1) {
    return target.fromNow()
  }

  // 1 天内显示相对时间
  return target.fromNow()
})
</script>

<style scoped>
.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter, #f0f0f0);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background-color: var(--el-fill-color-light, #f5f7fa);
}

.notification-item.unread {
  background-color: var(--el-color-primary-light-9, #ecf5ff);
}

.notification-item.unread:hover {
  background-color: var(--el-color-primary-light-8, #d9ecff);
}

.unread-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--el-color-primary, #409eff);
  margin-top: 6px;
  box-shadow: 0 0 0 2px var(--el-color-primary-light-7, #c6e2ff);
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 2px var(--el-color-primary-light-7, #c6e2ff);
  }
  50% {
    box-shadow: 0 0 0 4px var(--el-color-primary-light-8, #d9ecff);
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.notification-tag {
  flex-shrink: 0;
  font-size: 11px;
  height: 20px;
  line-height: 18px;
  padding: 0 6px;
  border-radius: 2px;
}

.notification-item-title {
  flex: 1;
  font-size: 13px;
  color: var(--el-text-color-primary, #303133);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.notification-preview {
  font-size: 12px;
  color: var(--el-text-color-regular, #606266);
  line-height: 1.4;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  font-size: 11px;
  color: var(--el-text-color-secondary, #909399);
  line-height: 1.3;
}
</style>
