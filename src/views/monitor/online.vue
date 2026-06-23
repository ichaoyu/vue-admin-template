<template>
  <div class="page-container">
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
        <el-input v-model="queryParams.userName" placeholder="用户账号" clearable style="width: 150px" />
        <el-input v-model="queryParams.loginIp" placeholder="登录IP" clearable style="width: 150px" />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button
          type="danger"
          size="small"
          link
          :icon="SwitchButton"
          v-permission="['monitor:online:force']"
          @click="handleForceLogout(row)"
          >强退</el-button
        >
      </template>
    </pro-table>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, SwitchButton } from '@element-plus/icons-vue'
import { useTable } from '@/hooks'
import { getOnlineUserListAPI, forceLogoutAPI } from '@/api/monitor/online'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'

defineOptions({ name: 'MonitorOnlineIndex' })

// #region 数据定义

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
} = useTable(getOnlineUserListAPI, {
  defaultParams: { userName: '', loginIp: '' },
})

const columns = [
  { prop: 'id', label: '会话ID', minWidth: 200 },
  { prop: 'userName', label: '用户账号', minWidth: 120 },
  { prop: 'loginIp', label: 'IP地址', minWidth: 140 },
  { prop: 'loginLocation', label: '登录地点', minWidth: 120 },
  { prop: 'browser', label: '浏览器', minWidth: 120 },
  { prop: 'os', label: '操作系统', minWidth: 120 },
  { prop: 'loginTime', label: '登录时间', minWidth: 180, formatter: (row) => formatDateTime(row.loginTime) },
  { prop: 'operation', label: '操作', width: 100, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 强制下线

const handleForceLogout = async (row) => {
  try {
    await ElMessageBox.confirm(`确认要强制下线用户"${row.userName}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await forceLogoutAPI(row.id)
    ElMessage.success('强制下线成功')
    getData()
  } catch {
    // user cancelled
  }
}

// #endregion
</script>
