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
        <el-input v-model="queryParams.postCode" placeholder="岗位编码" clearable style="width: 200px" />
        <el-input v-model="queryParams.postName" placeholder="岗位名称" clearable style="width: 200px" />
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="岗位状态"
          clearable
          style="width: 120px"
        />
        <el-button v-permission="['system:post:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button
          v-permission="['system:post:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button
          v-permission="['system:post:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-permission="['system:post:delete']"
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
      content-height="300px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="岗位编码:" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入岗位编码" clearable />
        </el-form-item>
        <el-form-item label="岗位名称:" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" clearable />
        </el-form-item>
        <el-form-item label="显示排序:" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <DictSelect v-model="form.status" dict-type="sys_normal_disable" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :rows="2" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import { getPostListAPI, createPostAPI, updatePostAPI, deletePostAPI, batchDeletePostsAPI } from '@/api/system/post'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'

defineOptions({
  name: 'SystemPostIndex',
})

// #region 数据定义

const formRef = ref(null)

const formDefaults = {
  id: '',
  postName: '',
  postCode: '',
  sort: 0,
  status: 1,
  remark: '',
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
  handleStatusChange,
  handleSelectionChange,
  handleBatchDelete,
} = useCrud(
  getPostListAPI,
  { create: createPostAPI, update: updatePostAPI, delete: deletePostAPI, batchDelete: batchDeletePostsAPI },
  {
    nameField: 'postName',
    formDefaults,
    defaultParams: { postCode: '', postName: '', status: '' },
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑岗位' : '新增岗位'))

const rules = {
  postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
  postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '序号', width: 60, align: 'center' },
  { prop: 'postName', label: '岗位名称', minWidth: 120 },
  { prop: 'postCode', label: '岗位编码', minWidth: 120 },
  { prop: 'sort', label: '排序', width: 100, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
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
