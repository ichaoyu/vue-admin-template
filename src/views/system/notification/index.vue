<template>
  <div class="notification-container">
    <!-- #region 表格 -->
    <pro-table
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:page="page"
      v-model:limit="limit"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @refresh="handleRefresh"
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.title" placeholder="标题" clearable style="width: 150px" />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </template>

      <!-- 类型 -->
      <template #type="{ row }">
        <el-tag :type="getNotificationType(row.type)" size="small">{{ getNotificationLabel(row.type) }}</el-tag>
      </template>

      <!-- 是否已读 -->
      <template #isRead="{ row }">
        <el-tag v-if="row.isRead === 1" type="success" size="small">已读</el-tag>
        <el-tag v-else type="danger" size="small">未读</el-tag>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button v-if="row.isRead === 0" type="success" size="small" link :icon="Check" @click="handleMarkRead(row)">标记已读</el-button>
      </template>
    </pro-table>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Search, Refresh, Check } from '@element-plus/icons-vue'
import { useTable } from '@/hooks'
import { getNotificationListAPI, markAsReadAPI } from '@/api/system/notification'
import { formatDateTime } from '@/utils/date'
import { getNotificationType, getNotificationLabel } from '@/utils/notification'
import ProTable from '@/components/Table/index.vue'

defineOptions({ name: 'SystemNotificationIndex' })

// #region 数据定义

const { tableData, loading, total, queryParams, page, limit, getData, handlePageChange, handleSizeChange, handleRefresh, handleSearch, resetQuery } = useTable(getNotificationListAPI, {
  defaultParams: { title: '' },
})

const columns = [
  { prop: 'title', label: '标题', minWidth: 180, showOverflowTooltip: true },
  { prop: 'content', label: '内容', minWidth: 280, showOverflowTooltip: true },
  { prop: 'type', label: '类型', width: 100, align: 'center', slot: 'type' },
  { prop: 'isRead', label: '是否已读', width: 100, align: 'center', slot: 'isRead' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 120, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 标记已读

const handleMarkRead = async (row) => {
  await markAsReadAPI({ id: row.id })
  ElMessage.success('已标记为已读')
  getData()
}

// #endregion
</script>

<style scoped>
.notification-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
