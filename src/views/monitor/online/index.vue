<template>
  <div class="online-container">
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
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.userName" placeholder="用户账号" clearable style="width: 150px" />
        <el-input v-model="queryParams.loginIp" placeholder="登录IP" clearable style="width: 150px" />
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="danger" size="small" link :icon="Delete" @click="handleForceLogout(row)">强制下线</el-button>
      </template>
    </pro-table>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import { getOnlineUserListAPI, forceLogoutAPI } from '@/api/monitor/online'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'

defineOptions({
  name: 'MonitorOnlineIndex',
})

// #region 数据定义

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  userName: '',
  loginIp: '',
})

const columns = [
  { prop: 'tokenId', label: '会话ID', minWidth: 200 },
  { prop: 'userName', label: '用户账号', minWidth: 120 },
  { prop: 'nickName', label: '用户昵称', minWidth: 120 },
  { prop: 'deptName', label: '部门名称', minWidth: 120 },
  { prop: 'loginIp', label: '登录IP', minWidth: 140 },
  { prop: 'loginLocation', label: '登录地点', minWidth: 120 },
  { prop: 'browser', label: '浏览器', minWidth: 120 },
  { prop: 'os', label: '操作系统', minWidth: 120 },
  { prop: 'loginTime', label: '登录时间', minWidth: 180, formatter: (row) => formatDateTime(row.loginTime) },
  { prop: 'operation', label: '操作', width: 120, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getOnlineUserListAPI(queryParams)
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取在线用户列表失败:', error)
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

// #region 强制下线

const handleForceLogout = (row) => {
  ElMessageBox.confirm(`确认要强制下线用户"${row.userName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await forceLogoutAPI(row.tokenId)
      ElMessage.success('强制下线成功')
      getData()
    } catch (error) {
      console.error('强制下线失败:', error)
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
.online-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
