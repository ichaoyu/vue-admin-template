<template>
  <div class="notification-container">
    <!-- #region 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #409eff">
              <el-icon :size="32"><Bell /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ unreadCount }}</div>
              <div class="stat-label">未读通知</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #67c23a">
              <el-icon :size="32"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ readCount }}</div>
              <div class="stat-label">已读通知</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #e6a23c">
              <el-icon :size="32"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalCount }}</div>
              <div class="stat-label">通知总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- #endregion -->

    <!-- #region 操作栏 -->
    <el-card shadow="hover" class="action-card">
      <div class="action-bar">
        <el-button type="primary" :icon="Plus" @click="handleSend">发送通知</el-button>
        <el-button type="success" :icon="Check" @click="handleMarkAllRead" :disabled="unreadCount === 0"
          >全部标记已读</el-button
        >
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
        <el-radio-group v-model="readFilter" @change="handleFilterChange" style="margin-left: 16px">
          <el-radio-button :value="null">全部</el-radio-button>
          <el-radio-button :value="0">未读</el-radio-button>
          <el-radio-button :value="1">已读</el-radio-button>
        </el-radio-group>
        <el-button :icon="Refresh" @click="handleRefresh" style="margin-left: auto">刷新</el-button>
      </div>
    </el-card>
    <!-- #endregion -->

    <!-- #region 通知列表 -->
    <el-card shadow="hover" class="list-card">
      <el-table
        v-loading="loading"
        :data="notificationList"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isRead === 1" type="success" size="small">已读</el-tag>
            <el-tag v-else type="danger" size="small">未读</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getNotificationType(row.type)" size="small">
              {{ getNotificationLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="content" label="内容" min-width="280" show-overflow-tooltip />
        <el-table-column prop="senderName" label="发送人" width="120" />
        <el-table-column label="发送时间" width="170">
          <template #default="{ row }">
            {{ formatDateTime(row.sendTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link :icon="View" @click="handleView(row)"> 查看 </el-button>
            <el-button
              v-if="row.isRead === 0"
              type="success"
              size="small"
              link
              :icon="Check"
              @click="handleMarkRead(row)"
            >
              标记已读
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    <!-- #endregion -->

    <!-- #region 发送通知对话框 -->
    <el-dialog v-model="sendVisible" title="发送通知" width="600px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="computedRules" label-width="100px">
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入通知标题" clearable />
        </el-form-item>
        <el-form-item label="通知内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入通知内容" :rows="4" />
        </el-form-item>
        <el-form-item label="通知类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择通知类型" style="width: 100%">
            <el-option label="系统通知" value="system" />
            <el-option label="公告" value="announcement" />
            <el-option label="提醒" value="reminder" />
            <el-option label="通知" value="notice" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标类型" prop="targetType">
          <el-radio-group v-model="form.targetType">
            <el-radio value="all">全员</el-radio>
            <el-radio value="user">指定用户</el-radio>
            <el-radio value="role">指定角色</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.targetType !== 'all'" label="目标ID" prop="targetIds">
          <el-input v-model="form.targetIds" placeholder="请输入目标ID，多个用逗号分隔" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sendVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 发送 </el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->

    <!-- #region 通知详情对话框 -->
    <el-dialog v-model="detailVisible" title="通知详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="通知标题">{{ currentNotification.title }}</el-descriptions-item>
        <el-descriptions-item label="通知类型">
          <el-tag :type="getNotificationType(currentNotification.type)" size="small">
            {{ getNotificationLabel(currentNotification.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发送人">{{ currentNotification.senderName }}</el-descriptions-item>
        <el-descriptions-item label="发送时间">{{ formatDateTime(currentNotification.sendTime) }}</el-descriptions-item>
        <el-descriptions-item label="阅读状态">
          <el-tag v-if="currentNotification.isRead === 1" type="success" size="small">已读</el-tag>
          <el-tag v-else type="danger" size="small">未读</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentNotification.readTime" label="阅读时间">
          {{ formatDateTime(currentNotification.readTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="通知内容">
          <div style="white-space: pre-wrap">{{ currentNotification.content }}</div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button v-if="currentNotification.isRead === 0" type="primary" @click="handleMarkRead(currentNotification)">
          标记已读
        </el-button>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Check, Refresh, View, Bell, CircleCheck, Document } from '@element-plus/icons-vue'
import { sendNotificationAPI, batchDeleteNotificationsAPI } from '@/api/system/notification'
import { formatDateTime } from '@/utils/date'
import { getNotificationType, getNotificationLabel } from '@/utils/notification'
import { useNotificationStore } from '@/store/notification'

defineOptions({
  name: 'SystemNotificationIndex',
})

// #region 数据定义

const submitLoading = ref(false)
const sendVisible = ref(false)
const detailVisible = ref(false)
const formRef = ref(null)
const readFilter = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
const selectedIds = ref([])

const notificationStore = useNotificationStore()

const unreadCount = computed(() => notificationStore.getUnreadCount)
const totalCount = computed(() => notificationStore.getTotal)
const readCount = computed(() => totalCount.value - unreadCount.value)
const notificationList = computed(() => notificationStore.getNotifications)
const loading = computed(() => notificationStore.isLoading)
const total = computed(() => notificationStore.getTotal)

const currentNotification = ref({})

const form = reactive({
  title: '',
  content: '',
  type: 'notice',
  targetType: 'all',
  targetIds: '',
})

const baseRules = {
  title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
  type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
  targetType: [{ required: true, message: '请选择目标类型', trigger: 'change' }],
}

const computedRules = computed(() => {
  const rules = { ...baseRules }
  if (form.targetType !== 'all') {
    rules.targetIds = [{ required: true, message: '请输入目标ID', trigger: 'blur' }]
  }
  return rules
})

// #endregion

// #region 数据获取

const loadData = async () => {
  await Promise.all([
    notificationStore.fetchNotifications({
      page: currentPage.value,
      pageSize: pageSize.value,
      isRead: readFilter.value,
    }),
    notificationStore.fetchUnreadCount(),
  ])
}

const handleRefresh = () => {
  loadData()
}

const handleFilterChange = () => {
  currentPage.value = 1
  loadData()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  loadData()
}

const handlePageChange = (val) => {
  currentPage.value = val
  loadData()
}

// #endregion

// #region 发送通知

const handleSend = () => {
  resetForm()
  sendVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return
  } catch {
    return
  }

  submitLoading.value = true
  try {
    const submitData = { ...form }
    if (form.targetType !== 'all' && form.targetIds) {
      const ids = form.targetIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
      submitData.targetIds = JSON.stringify(ids)
    }
    await sendNotificationAPI(submitData)
    ElMessage.success('发送成功')
    sendVisible.value = false
    loadData()
  } catch (error) {
    console.error('发送通知失败:', error)
    ElMessage.error('发送失败')
  } finally {
    submitLoading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    title: '',
    content: '',
    type: 'notice',
    targetType: 'all',
    targetIds: '',
  })
}

// #endregion

// #region 批量操作

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的通知')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认要删除选中的 ${selectedIds.value.length} 条通知吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await batchDeleteNotificationsAPI(selectedIds.value)
    ElMessage.success('删除成功')
    loadData()
    selectedIds.value = []
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败，请重试')
    }
  }
}

// #endregion

// #region 标记已读

const handleMarkRead = async (row) => {
  try {
    await notificationStore.markAsRead(row.id)
    ElMessage.success('已标记为已读')
    detailVisible.value = false
  } catch (error) {
    console.error('标记已读失败:', error)
    ElMessage.error('操作失败')
  }
}

const handleMarkAllRead = async () => {
  try {
    await notificationStore.markAllAsRead()
    ElMessage.success('已全部标记为已读')
    loadData()
  } catch (error) {
    console.error('全部标记已读失败:', error)
    ElMessage.error('操作失败')
  }
}

// #endregion

// #region 查看详情

const handleView = (row) => {
  currentNotification.value = { ...row }
  detailVisible.value = true
}

// #endregion

// #region 生命周期

onMounted(() => {
  loadData()
})

// #endregion
</script>

<style scoped>
.notification-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
}

.stats-row {
  margin-bottom: 0;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.action-card {
  margin-bottom: 0;
}

.action-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.list-card {
  margin-bottom: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
