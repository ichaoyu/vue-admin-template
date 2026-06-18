<template>
  <div class="oper-log-container">
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
        <el-input v-model="queryParams.title" placeholder="操作模块" clearable style="width: 150px" />
        <el-input v-model="queryParams.operName" placeholder="操作人员" clearable style="width: 150px" />
        <el-select v-model="queryParams.bizType" placeholder="业务类型" clearable style="width: 120px">
          <el-option label="其他" value="0" />
          <el-option label="新增" value="1" />
          <el-option label="修改" value="2" />
          <el-option label="删除" value="3" />
          <el-option label="授权" value="4" />
          <el-option label="导出" value="5" />
          <el-option label="导入" value="6" />
          <el-option label="强退" value="7" />
          <el-option label="生成代码" value="8" />
          <el-option label="清空" value="9" />
        </el-select>
        <el-select v-model="queryParams.status" placeholder="操作状态" clearable style="width: 120px">
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

      <!-- 业务类型 -->
      <template #bizType="{ row }">
        <el-tag type="info" size="small">{{ row.bizType || '-' }}</el-tag>
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
      title="操作日志详情"
      width="700px"
      content-height="500px"
      :show-confirm="false"
      cancel-text="关闭"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作模块">{{ detailData.title }}</el-descriptions-item>
        <el-descriptions-item label="业务类型">
          <el-tag type="info" size="small">{{ detailData.bizType || '-' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作人员">{{ detailData.operName }}</el-descriptions-item>
        <el-descriptions-item label="操作状态">
          <el-tag v-if="detailData.status === 0" type="success" size="small">成功</el-tag>
          <el-tag v-else type="danger" size="small">失败</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ detailData.method }}</el-descriptions-item>
        <el-descriptions-item label="请求方式">{{ detailData.requestMethod }}</el-descriptions-item>
        <el-descriptions-item label="操作IP">{{ detailData.operIp }}</el-descriptions-item>
        <el-descriptions-item label="操作地点">{{ detailData.operLocation }}</el-descriptions-item>
        <el-descriptions-item label="操作时间" :span="2">{{
          formatDateTime(detailData.operTime)
        }}</el-descriptions-item>
        <el-descriptions-item label="请求URL" :span="2">{{ detailData.requestUrl }}</el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <el-scrollbar max-height="100px">
            <pre style="margin: 0; white-space: pre-wrap; word-break: break-all">{{ detailData.requestParams }}</pre>
          </el-scrollbar>
        </el-descriptions-item>
        <el-descriptions-item label="返回结果" :span="2">
          <el-scrollbar max-height="100px">
            <pre style="margin: 0; white-space: pre-wrap; word-break: break-all">{{ detailData.requestResult }}</pre>
          </el-scrollbar>
        </el-descriptions-item>
        <el-descriptions-item v-if="detailData.errorMsg" label="错误信息" :span="2">
          <el-scrollbar max-height="100px">
            <pre style="margin: 0; color: #f56c6c; white-space: pre-wrap; word-break: break-all">{{
              detailData.errorMsg
            }}</pre>
          </el-scrollbar>
        </el-descriptions-item>
      </el-descriptions>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete, View } from '@element-plus/icons-vue'
import { getOperLogListAPI, getOperLogDetailAPI, deleteOperLogAPI, batchDeleteOperLogsAPI, clearOperLogAPI } from '@/api/monitor/operLog'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'

defineOptions({
  name: 'MonitorOperLogIndex',
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
  title: '',
  operName: '',
  bizType: '',
  status: '',
  beginTime: '',
  endTime: '',
})

const dialogVisible = ref(false)
const detailData = ref({})

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'title', label: '操作模块', minWidth: 120 },
  { prop: 'bizType', label: '业务类型', width: 100, align: 'center', slot: 'bizType' },
  { prop: 'operName', label: '操作人员', minWidth: 100 },
  { prop: 'requestMethod', label: '请求方式', width: 100, align: 'center' },
  { prop: 'operIp', label: '操作IP', minWidth: 140 },
  { prop: 'operLocation', label: '操作地点', minWidth: 120 },
  { prop: 'status', label: '操作状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'operTime', label: '操作时间', minWidth: 180, formatter: (row) => formatDateTime(row.operTime) },
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
    const res = await getOperLogListAPI(params)
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取操作日志列表失败:', error)
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
  queryParams.title = ''
  queryParams.operName = ''
  queryParams.bizType = ''
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
    const res = await getOperLogDetailAPI(row.id)
    detailData.value = res || {}
    dialogVisible.value = true
  } catch (error) {
    console.error('获取操作日志详情失败:', error)
  }
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除该操作日志吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteOperLogAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的操作日志')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条操作日志吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteOperLogsAPI(selectedIds.value)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  })
}

const handleClear = () => {
  ElMessageBox.confirm('确认要清空所有操作日志吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await clearOperLogAPI()
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
.oper-log-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
