<template>
  <div class="permission-container">
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
        <el-input v-model="queryParams.permissionName" placeholder="权限名称" clearable style="width: 150px" />
        <el-input v-model="queryParams.permissionCode" placeholder="权限编码" clearable style="width: 150px" />
        <el-input v-model="queryParams.resourceId" placeholder="资源 ID" clearable style="width: 150px" />
        <DictSelect
          v-model="queryParams.actionType"
          dict-type="sys_action_type"
          placeholder="操作类型"
          clearable
          style="width: 120px"
        />
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="状态"
          clearable
          style="width: 100px"
        />
        <el-button v-permission="['system:permission:add']" type="primary" :icon="Plus" @click="handleAdd"
          >新增</el-button
        >
        <el-button
          v-permission="['system:permission:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 操作类型 -->
      <template #actionType="{ row }">
        <DictTag :value="row.actionType" dict-type="sys_action_type" />
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <StatusSwitch
          v-model="row.status"
          :id="row.id"
          :api="updatePermissionAPI"
          :active-value="1"
          :inactive-value="0"
          active-text="正常"
          inactive-text="停用"
        />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button
          v-permission="['system:permission:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
          >编辑</el-button
        >
        <ConfirmButton
          v-permission="['system:permission:delete']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          text="删除"
          :message="`确认删除权限'${row.permissionName}'吗？`"
          :on-confirm="() => handleDelete(row)"
        />
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="650px"
      content-height="450px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="权限名称:" prop="permissionName">
          <el-input v-model="form.permissionName" placeholder="请输入权限名称" clearable />
        </el-form-item>
        <el-form-item label="权限编码:" prop="permissionCode">
          <el-input v-model="form.permissionCode" placeholder="请输入权限编码" clearable />
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            权限的唯一标识，如：system:user:add
          </div>
        </el-form-item>
        <el-form-item label="资源 ID:" prop="resourceId">
          <el-input v-model="form.resourceId" placeholder="请输入资源 ID" clearable />
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            关联的资源标识，如：user、menu、role 等
          </div>
        </el-form-item>
        <el-form-item label="操作类型:" prop="actionType">
          <DictSelect
            v-model="form.actionType"
            dict-type="sys_action_type"
            placeholder="请选择操作类型"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <DictSelect v-model="form.status" dict-type="sys_normal_disable" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :rows="2" clearable />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { Plus, Edit, Delete, InfoFilled } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import {
  getPermissionListAPI,
  createPermissionAPI,
  updatePermissionAPI,
  deletePermissionAPI,
  batchDeletePermissionsAPI,
} from '@/api/system/permission'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'

defineOptions({
  name: 'SystemPermissionIndex',
})

// #region 数据定义

const formRef = ref(null)

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
  handleAdd,
  handleEdit,
  handleSubmit,
  handleDelete,
  handleSelectionChange,
  handleBatchDelete,
} = useCrud(
  getPermissionListAPI,
  {
    create: createPermissionAPI,
    update: updatePermissionAPI,
    delete: deletePermissionAPI,
    batchDelete: batchDeletePermissionsAPI,
  },
  {
    nameField: 'permissionName',
    formDefaults: { permissionName: '', permissionCode: '', resourceId: '', actionType: '', status: 1, remark: '' },
    defaultParams: { permissionName: '', permissionCode: '', resourceId: '', actionType: '', status: '' },
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑权限' : '新增权限'))

const rules = {
  permissionName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
  permissionCode: [{ required: true, message: '权限编码不能为空', trigger: 'blur' }],
  resourceId: [{ required: true, message: '资源 ID 不能为空', trigger: 'blur' }],
  actionType: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'permissionName', label: '权限名称', minWidth: 150 },
  { prop: 'permissionCode', label: '权限编码', minWidth: 180 },
  { prop: 'actionType', label: '操作类型', width: 100, align: 'center', slot: 'actionType' },
  { prop: 'status', label: '状态', width: 120, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 提交

const onSubmit = () => {
  handleSubmit(formRef.value)
}

// #endregion
</script>

<style scoped>
.permission-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
