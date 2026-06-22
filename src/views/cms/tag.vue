<template>
  <div class="tag-container">
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
        <el-button v-permission="['cms:tag:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button
          v-permission="['cms:tag:delete']"
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
          v-permission="['cms:tag:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-permission="['cms:tag:delete']"
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

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      content-height="250px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标签名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" clearable />
        </el-form-item>
        <el-form-item label="标签路径:" prop="path">
          <el-input v-model="form.path" placeholder="请输入标签路径" clearable />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import { getTagListAPI, createTagAPI, updateTagAPI, deleteTagAPI, batchDeleteTagsAPI } from '@/api/cms/tag'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'

defineOptions({
  name: 'CmsTagIndex',
})

// #region 数据定义

const formRef = ref(null)

const formDefaults = {
  id: '',
  name: '',
  path: '',
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
  form,
  dialogVisible,
  submitLoading,
  selectedIds,
  resetForm,
  handleAdd,
  handleEdit,
  handleSubmit,
  handleDelete,
  handleSelectionChange,
  handleBatchDelete,
} = useCrud(
  getTagListAPI,
  { create: createTagAPI, update: updateTagAPI, delete: deleteTagAPI, batchDelete: batchDeleteTagsAPI },
  {
    nameField: 'name',
    formDefaults,
    defaultParams: {},
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑标签' : '新增标签'))

const rules = {
  name: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '序号', width: 60, align: 'center' },
  { prop: 'name', label: '标签名称', minWidth: 150 },
  { prop: 'path', label: '标签路径', minWidth: 150 },
  { prop: 'count', label: '文章数', width: 100, align: 'center' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 提交

const onSubmit = () => {
  handleSubmit(formRef.value)
}

// #endregion
</script>

<style scoped>
.tag-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
