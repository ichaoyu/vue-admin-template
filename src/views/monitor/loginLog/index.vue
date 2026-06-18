<template>
  <div class="login-log-container">
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
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.userName" placeholder="用户账号" clearable style="width: 150px" />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
        <el-button type="danger" :icon="Delete" v-permission="['monitor:loginLog:clear']" @click="handleClear">清空</el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="success" size="small">成功</el-tag>
        <el-tag v-else type="danger" size="small">失败</el-tag>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="danger" size="small" link :icon="Delete" v-permission="['monitor:loginLog:delete']" @click="handleDelete(row)">删除</el-button>
      </template>
    </pro-table>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import { useTable } from '@/hooks'
import { getLoginLogListAPI, deleteLoginLogAPI, batchDeleteLoginLogsAPI, clearLoginLogAPI } from '@/api/monitor/loginLog'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'

defineOptions({ name: 'MonitorLoginLogIndex' })

// #region 数据定义

const selectedIds = ref([])

const { tableData, loading, total, queryParams, page, limit, getData, handlePageChange, handleSizeChange, handleRefresh, handleSearch, resetQuery } = useTable(getLoginLogListAPI, {
  defaultParams: { userName: '' },
})

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '序号', width: 60, align: 'center' },
  { prop: 'userName', label: '用户账号', minWidth: 120 },
  { prop: 'loginIp', label: '登录IP', minWidth: 140 },
  { prop: 'loginLocation', label: '登录地点', minWidth: 120 },
  { prop: 'browser', label: '浏览器', minWidth: 120 },
  { prop: 'os', label: '操作系统', minWidth: 120 },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'loginTime', label: '登录时间', minWidth: 180, formatter: (row) => formatDateTime(row.loginTime) },
  { prop: 'operation', label: '操作', width: 100, align: 'center', fixed: 'right', slot: 'operation' },
]

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm('确认要删除该登录日志吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteLoginLogAPI(row.id)
    ElMessage.success('删除成功')
    getData()
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) return
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条登录日志吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await batchDeleteLoginLogsAPI(selectedIds.value)
    ElMessage.success('删除成功')
    getData()
  })
}

const handleClear = () => {
  ElMessageBox.confirm('确认要清空所有登录日志吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await clearLoginLogAPI()
    ElMessage.success('清空成功')
    getData()
  })
}

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
