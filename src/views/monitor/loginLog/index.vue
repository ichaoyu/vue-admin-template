<template>
  <div class="login-log-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="queryParams.page"
      :limit="queryParams.pageSize"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @refresh="handleRefresh"
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.userName" placeholder="用户账号" clearable style="width: 150px" />
        <el-input v-model="queryParams.loginIp" placeholder="登录IP" clearable style="width: 150px" />
        <el-select v-model="queryParams.status" placeholder="登录状态" clearable style="width: 120px">
          <el-option label="成功" value="0" />
          <el-option label="失败" value="1" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 240px"
        />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
        <el-button type="danger" :icon="Delete" @click="handleClear">清空</el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="success" size="small">成功</el-tag>
        <el-tag v-else type="danger" size="small">失败</el-tag>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" size="small" link :icon="View" @click="handleView(row)">详情</el-button>
        <el-button type="danger" size="small" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 详情弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      title="登录日志详情"
      width="600px"
      content-height="400px"
      :show-confirm="false"
      cancel-text="关闭"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户账号">{{ detailData.userName }}</el-descriptions-item>
        <el-descriptions-item label="登录状态">
          <el-tag v-if="detailData.status === 0" type="success" size="small">成功</el-tag>
          <el-tag v-else type="danger" size="small">失败</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="登录IP">{{ detailData.loginIp }}</el-descriptions-item>
        <el-descriptions-item label="登录地点">{{ detailData.loginLocation }}</el-descriptions-item>
        <el-descriptions-item label="浏览器">{{ detailData.browser }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ detailData.os }}</el-descriptions-item>
        <el-descriptions-item label="提示消息" :span="2">{{ detailData.msg }}</el-descriptions-item>
        <el-descriptions-item label="登录时间" :span="2">{{
          formatDateTime(detailData.loginDate)
        }}</el-descriptions-item>
      </el-descriptions>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete, View } from '@element-plus/icons-vue'
import { getLoginLogListAPI, getLoginLogDetailAPI, deleteLoginLogAPI, batchDeleteLoginLogsAPI, clearLoginLogAPI } from '@/api/monitor/loginLog'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'

defineOptions({
  name: 'MonitorLoginLogIndex',
})

// #region 数据定义

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dateRange = ref([])
const selectedIds = ref([])

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  userName: '',
  loginIp: '',
  status: '',
  beginTime: '',
  endTime: '',
})

const dialogVisible = ref(false)
const detailData = ref({})

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'userName', label: '用户账号', minWidth: 120 },
  { prop: 'loginIp', label: '登录IP', minWidth: 140 },
  { prop: 'loginLocation', label: '登录地点', minWidth: 120 },
  { prop: 'browser', label: '浏览器', minWidth: 120 },
  { prop: 'os', label: '操作系统', minWidth: 120 },
  { prop: 'status', label: '登录状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'msg', label: '提示消息', minWidth: 150 },
  { prop: 'loginDate', label: '登录时间', minWidth: 180, formatter: (row) => formatDateTime(row.loginDate) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// #endregion

// #region 数据获取

const getData = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    queryParams.beginTime = dateRange.value[0]
    queryParams.endTime = dateRange.value[1]
  } else {
    queryParams.beginTime = ''
    queryParams.endTime = ''
  }

  loading.value = true
  try {
    const params = {}
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== '' && queryParams[key] !== null && queryParams[key] !== undefined) {
        params[key] = queryParams[key]
      }
    })
    const res = await getLoginLogListAPI(params)
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取登录日志列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  getData()
}

const handleSearch = () => {
  queryParams.page = 1
  getData()
}

const handleReset = () => {
  queryParams.userName = ''
  queryParams.loginIp = ''
  queryParams.status = ''
  dateRange.value = []
  queryParams.page = 1
  getData()
}

const handlePageChange = (page) => {
  queryParams.page = page
  getData()
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.page = 1
  getData()
}

// #endregion

// #region 查看详情

const handleView = async (row) => {
  try {
    const res = await getLoginLogDetailAPI(row.id)
    detailData.value = res || {}
    dialogVisible.value = true
  } catch (error) {
    console.error('获取登录日志详情失败:', error)
  }
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除该登录日志吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteLoginLogAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的登录日志')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条登录日志吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteLoginLogsAPI(selectedIds.value)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  })
}

const handleClear = () => {
  ElMessageBox.confirm('确认要清空所有登录日志吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await clearLoginLogAPI()
      ElMessage.success('清空成功')
      getData()
    } catch (error) {
      console.error('清空失败:', error)
    }
  })
}

// #endregion

// #region 生命周期

onMounted(() => {
  getData()
})

// #endregion
</script>

<style scoped>
.login-log-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
