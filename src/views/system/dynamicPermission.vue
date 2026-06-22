<template>
  <div class="dynamic-permission-container">
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
        <el-input v-model="queryParams.ruleName" placeholder="规则名称" clearable style="width: 150px" />
        <el-input v-model="queryParams.conditionExpression" placeholder="条件表达式" clearable style="width: 150px" />
        <el-button type="primary" :icon="Plus" v-permission="'dynamic:permission:add'" @click="onAdd">新增</el-button>
        <el-button
          type="danger"
          :disabled="selectedIds.length === 0"
          v-permission="'dynamic:permission:delete'"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- #region 条件表达式 -->
      <template #conditionExpression="{ row }">
        <span>{{ row.conditionExpression }}</span>
      </template>
      <!-- #endregion -->

      <!-- #region 状态 -->
      <template #status="{ row }">
        <status-switch
          v-model="row.status"
          :id="row.id"
          :api="updateDynamicPermissionAPI"
          :active-value="1"
          :inactive-value="0"
          active-text="正常"
          inactive-text="停用"
        />
      </template>
      <!-- #endregion -->

      <!-- #region 操作 -->
      <template #operation="{ row }">
        <el-button
          type="primary"
          size="small"
          link
          :icon="Edit"
          v-permission="'dynamic:permission:edit'"
          @click="onEdit(row)"
        >
          编辑
        </el-button>
        <confirm-button
          type="danger"
          size="small"
          link
          :icon="Delete"
          text="删除"
          message="确认删除该动态权限规则吗？"
          v-permission="'dynamic:permission:delete'"
          :on-confirm="() => handleDelete(row)"
        />
      </template>
      <!-- #endregion -->
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="规则名称:" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输入规则名称" clearable />
        </el-form-item>
        <el-form-item label="资源类型:" prop="resourceType">
          <el-input v-model="form.resourceType" placeholder="请输入资源类型" clearable />
        </el-form-item>
        <el-form-item label="条件表达式:" prop="conditionExpression">
          <el-input
            v-model="form.conditionExpression"
            type="textarea"
            :rows="4"
            placeholder="请输入条件表达式"
            clearable
          />
        </el-form-item>
        <el-form-item label="优先级:" prop="priority">
          <el-input-number v-model="form.priority" :min="0" :max="999" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" clearable />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import {
  getDynamicPermissionListAPI,
  createDynamicPermissionAPI,
  updateDynamicPermissionAPI,
  deleteDynamicPermissionAPI,
  batchDeleteDynamicPermissionAPI,
} from '@/api/system/dynamicPermission'
import { formatDateTime } from '@/utils/date'
import { useCrud } from '@/hooks'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'

defineOptions({
  name: 'SystemDynamicPermissionIndex',
})

// #region useCrud

const crudState = useCrud(
  getDynamicPermissionListAPI,
  {
    create: createDynamicPermissionAPI,
    update: updateDynamicPermissionAPI,
    delete: deleteDynamicPermissionAPI,
    batchDelete: batchDeleteDynamicPermissionsAPI,
  },
  {
    nameField: 'ruleName',
    formDefaults: { ruleName: '', resourceType: '', conditionExpression: '', priority: 0, status: 1, remark: '' },
  }
)

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
} = crudState

// #endregion

// #region 数据定义

const tableRef = ref(null)
const formRef = ref(null)

const dialogTitle = computed(() => (form.value.id ? '编辑动态权限规则' : '新增动态权限规则'))

const rules = {
  ruleName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
  resourceType: [{ required: true, message: '资源类型不能为空', trigger: 'blur' }],
  conditionExpression: [{ required: true, message: '条件表达式不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '序号', width: 60, align: 'center' },
  { prop: 'ruleName', label: '规则名称', minWidth: 150 },
  { prop: 'resourceType', label: '资源类型', minWidth: 120 },
  {
    prop: 'conditionExpression',
    label: '条件表达式',
    minWidth: 200,
    'show-overflow-tooltip': true,
    slot: 'conditionExpression',
  },
  { prop: 'priority', label: '优先级', width: 80, align: 'center' },
  { prop: 'status', label: '状态', width: 120, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 新增/编辑

const onAdd = () => {
  resetForm()
  handleAdd()
}

const onEdit = (row) => {
  resetForm()
  handleEdit(row)
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  handleSubmit()
}

// #endregion
</script>

<style scoped>
.dynamic-permission-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
