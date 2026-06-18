<template>
  <div class="oper-log-container">
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
        <el-input v-model="queryParams.title" placeholder="操作模块" clearable style="width: 150px" />
        <el-input v-model="queryParams.operName" placeholder="操作人员" clearable style="width: 150px" />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
        <el-button type="danger" :icon="Delete" v-permission="['monitor:operLog:clear']" @click="handleClear">清空</el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="success" size="small">成功</el-tag>
        <el-tag v-else type="danger" size="small">失败</el-tag>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="danger" size="small" link :icon="Delete" v-permission="['monitor:operLog:delete']" @click="handleDelete(row)">删除</el-button>
      </template>
    </pro-table>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import { useTable } from '@/hooks'
import { getOperLogListAPI, deleteOperLogAPI, batchDeleteOperLogsAPI, clearOperLogAPI } from '@/api/monitor/operLog'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'

defineOptions({ name: 'MonitorOperLogIndex' })

// #region 数据定义

const selectedIds = ref([])

const { tableData, loading, total, queryParams, page, limit, getData, handlePageChange, handleSizeChange, handleRefresh, handleSearch, resetQuery } = useTable(getOperLogListAPI, {
  defaultParams: { title: '', operName: '' },
})

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '序号', width: 60, align: 'center' },
  { prop: 'title', label: '操作模块', minWidth: 120 },
  { prop: 'operName', label: '操作人', minWidth: 100 },
  { prop: 'requestMethod', label: '请求方法', width: 100, align: 'center' },
  { prop: 'operIp', label: 'IP地址', minWidth: 140 },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'operTime', label: '操作时间', minWidth: 180, formatter: (row) => formatDateTime(row.operTime) },
  { prop: 'operation', label: '操作', width: 100, align: 'center', fixed: 'right', slot: 'operation' },
]

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm('确认要删除该操作日志吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteOperLogAPI(row.id)
    ElMessage.success('删除成功')
    getData()
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) return
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条操作日志吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await batchDeleteOperLogsAPI(selectedIds.value)
    ElMessage.success('删除成功')
    getData()
  })
}

const handleClear = () => {
  ElMessageBox.confirm('确认要清空所有操作日志吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await clearOperLogAPI()
    ElMessage.success('清空成功')
    getData()
  })
}

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
