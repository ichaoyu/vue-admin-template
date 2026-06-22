<template>
  <div class="message-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      @refresh="handleRefresh"
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-button
          v-permission="['cms:message:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button
          v-permission="['cms:message:delete']"
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
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { useTable } from '@/hooks'
import { getMessageListAPI, deleteMessageAPI, batchDeleteMessagesAPI } from '@/api/cms/message'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'

defineOptions({
  name: 'CmsMessageIndex',
})

// #region 数据定义

const selectedIds = ref([])

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
} = useTable(getMessageListAPI, {
  defaultParams: {},
})

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '序号', width: 60, align: 'center' },
  { prop: 'name', label: '昵称', minWidth: 120 },
  { prop: 'title', label: '标题', minWidth: 120 },
  { prop: 'content', label: '留言内容', minWidth: 200, showOverflowTooltip: true },
  { prop: 'tel', label: '电话', width: 130, align: 'center' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 100, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 删除

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认要删除该留言吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteMessageAPI(row.id)
    ElMessage.success('删除成功')
    getData()
  } catch (error) {
    if (error !== 'cancel') {
      // 错误由 axios 拦截器统一处理
    }
  }
}

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的留言')
    return
  }

  try {
    await ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条留言吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await batchDeleteMessagesAPI(selectedIds.value)
    ElMessage.success('删除成功')
    selectedIds.value = []
    getData()
  } catch (error) {
    if (error !== 'cancel') {
      // 错误由 axios 拦截器统一处理
    }
  }
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// #endregion
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
