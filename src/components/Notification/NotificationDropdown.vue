<template>
  <div class="notification-dropdown">
    <!-- 标题栏 -->
    <div class="notification-header">
      <h3 class="notification-title">通知</h3>
      <el-button size="small" type="primary" text :disabled="unreadCount === 0" @click.stop="$emit('markAllRead')">
        全部标记已读
      </el-button>
    </div>

    <!-- 通知列表 -->
    <div class="notification-list">
      <template v-if="notifications.length > 0">
        <NotificationItem
          v-for="item in notifications"
          :key="item.id"
          :notification="item"
          @click="$emit('notificationClick', item)"
        />
      </template>

      <!-- 空状态 -->
      <div v-else class="notification-empty">
        <el-icon class="empty-icon"><Bell /></el-icon>
        <p class="empty-text">暂无未读通知</p>
      </div>
    </div>

    <!-- 底部查看全部 -->
    <div class="notification-footer">
      <el-button size="small" type="primary" text @click="$emit('viewAll')"> 查看所有消息 </el-button>
    </div>
  </div>
</template>

<script setup>
import { Bell } from '@element-plus/icons-vue'
import NotificationItem from './NotificationItem.vue'

defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
})

defineEmits(['markAllRead', 'notificationClick', 'viewAll'])
</script>

<style scoped>
.notification-dropdown {
  width: 360px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 6px 16px rgb(0 0 0 / 8%),
    0 3px 6px rgb(0 0 0 / 6%),
    0 1px 2px rgb(0 0 0 / 4%);
  background-color: var(--el-bg-color, #fff);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter, #f0f0f0);
  background-color: var(--el-fill-color-lighter, #fafafa);
  flex-shrink: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--el-text-color-primary, #303133);
  margin: 0;
  line-height: 1.4;
}

.notification-header .el-button {
  font-size: 12px;
  padding: 0;
  height: 24px;
  line-height: 24px;
}

.notification-list {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
}

/* 滚动条样式 */
.notification-list::-webkit-scrollbar {
  width: 4px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: var(--el-border-color, #c0c4cc);
  border-radius: 2px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: var(--el-text-color-secondary, #909399);
}

.notification-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  gap: 12px;
}

.empty-icon {
  font-size: 32px;
  color: var(--el-text-color-placeholder, #c0c4cc);
}

.empty-text {
  font-size: 13px;
  color: var(--el-text-color-secondary, #909399);
  margin: 0;
}

.notification-footer {
  text-align: center;
  padding: 10px 16px;
  border-top: 1px solid var(--el-border-color-lighter, #f0f0f0);
  background-color: var(--el-fill-color-lighter, #fafafa);
  flex-shrink: 0;
}

.notification-footer .el-button {
  font-size: 12px;
  padding: 0;
  height: 24px;
  line-height: 24px;
  font-weight: 500;
}
</style>
