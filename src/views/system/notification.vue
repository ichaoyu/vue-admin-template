<template>
  <div class="page-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:page="page"
      v-model:limit="limit"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @refresh="handleRefresh"
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.title" placeholder="标题" clearable style="width: 150px" />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button v-permission="['sys:notification:add']" type="primary" :icon="Plus" @click="onAdd"
          >发送通知</el-button
        >
        <el-button
          v-permission="['sys:notification:remove']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 类型 -->
      <template #type="{ row }">
        <el-tag :type="getNotificationType(row.type)" size="small">{{ getNotificationLabel(row.type) }}</el-tag>
      </template>

      <!-- 目标类型 -->
      <template #targetType="{ row }">
        <el-tag v-if="row.targetType === 'all'" type="success" size="small">全体</el-tag>
        <el-tag v-else-if="row.targetType === 'role'" type="warning" size="small">角色</el-tag>
        <el-tag v-else type="info" size="small">用户</el-tag>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button v-if="row.isRead === 0" type="success" size="small" link :icon="Check" @click="handleMarkRead(row)"
          >标记已读</el-button
        >
        <el-button
          v-permission="['sys:notification:remove']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 发送通知弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      title="发送通知"
      width="600px"
      content-height="400px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题:" prop="title">
          <el-input v-model="form.title" placeholder="请输入通知标题" />
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入通知内容" :rows="4" />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-select v-model="form.type" placeholder="请选择通知类型" style="width: 100%">
            <el-option label="通知" value="notice" />
            <el-option label="系统" value="system" />
            <el-option label="公告" value="announcement" />
            <el-option label="提醒" value="reminder" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标类型:" prop="targetType">
          <el-select v-model="form.targetType" placeholder="请选择目标类型" style="width: 100%">
            <el-option label="全体用户" value="all" />
            <el-option label="指定用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.targetType === 'user'" label="目标用户ID:" prop="targetIds">
          <el-input v-model="form.targetIds" type="textarea" placeholder="请输入用户ID，多个用逗号分隔" :rows="2" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Search, Refresh, Check, Delete, Plus } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import {
  getNotificationManageListAPI,
  sendNotificationAPI,
  batchDeleteNotificationsAPI,
  markAsReadAPI,
} from '@/api/system/notification'
import { formatDateTime } from '@/utils/date'
import { getNotificationType, getNotificationLabel } from '@/utils/notification'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'

defineOptions({ name: 'SystemNotificationIndex' })

// #region 数据定义

const formRef = ref(null)

const formDefaults = {
  title: '',
  content: '',
  type: 'notice',
  targetType: 'all',
  targetIds: '',
}

const {
  tableData,
  loading,
  total,
  queryParams,
  page,
  limit,
  getData,
  handlePageChange,
  handleSizeChange,
  handleRefresh,
  handleSearch,
  resetQuery,
  form,
  dialogVisible,
  submitLoading,
  selectedIds,
  handleAdd,
  handleSubmit,
  handleDelete,
  handleSelectionChange,
  handleBatchDelete,
} = useCrud(
  getNotificationManageListAPI,
  {
    create: sendNotificationAPI,
    delete: (id) => batchDeleteNotificationsAPI([id]),
    batchDelete: batchDeleteNotificationsAPI,
  },
  {
    nameField: 'title',
    formDefaults,
    defaultParams: { title: '' },
    formatSubmitData: (formData) => {
      // 将逗号分隔的 targetIds 转为 JSON 数组字符串
      if (formData.targetType === 'user' && formData.targetIds) {
        const ids = formData.targetIds
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
        return { ...formData, targetIds: JSON.stringify(ids) }
      }
      return formData
    },
  }
)

const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'title', label: '标题', minWidth: 180, showOverflowTooltip: true },
  { prop: 'content', label: '内容', minWidth: 280, showOverflowTooltip: true },
  { prop: 'type', label: '类型', width: 100, align: 'center', slot: 'type' },
  { prop: 'targetType', label: '目标', width: 100, align: 'center', slot: 'targetType' },
  { prop: 'senderName', label: '发送人', width: 120, align: 'center' },
  { prop: 'sendTime', label: '发送时间', minWidth: 180, formatter: (row) => formatDateTime(row.sendTime) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 发送通知

const onAdd = () => {
  handleAdd()
}

const onSubmit = () => {
  handleSubmit(formRef.value)
}

// #endregion

// #region 标记已读

const handleMarkRead = async (row) => {
  await markAsReadAPI({ id: row.id })
  ElMessage.success('已标记为已读')
  getData()
}

// #endregion
</script>
