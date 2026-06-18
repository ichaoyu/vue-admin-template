<template>
  <div class="data-permission-container">
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
        <el-input v-model="queryParams.ruleName" placeholder="规则名称" clearable style="width: 200px" />
        <el-select v-model="queryParams.resourceType" placeholder="资源类型" clearable style="width: 150px">
          <el-option label="用户" value="user" />
          <el-option label="角色" value="role" />
          <el-option label="部门" value="dept" />
          <el-option label="菜单" value="menu" />
          <el-option label="岗位" value="post" />
          <el-option label="字典" value="dict" />
        </el-select>
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="状态"
          clearable
          style="width: 120px"
        />
        <el-button v-permission="['system:dataPermission:add']" type="primary" :icon="Plus" @click="onAdd">新增</el-button>
        <el-button v-permission="['system:dataPermission:delete']" type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 范围类型 -->
      <template #scopeType="{ row }">
        <DictTag :value="row.scopeType" dict-type="sys_data_scope" />
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <StatusSwitch
          v-model="row.status"
          :id="row.id"
          :api="updateDataPermissionAPI"
          :active-value="1"
          :inactive-value="0"
          active-text="正常"
          inactive-text="停用"
        />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button v-permission="['system:dataPermission:edit']" type="primary" size="small" link :icon="Edit" @click="onEdit(row)">编辑</el-button>
        <ConfirmButton
          v-permission="['system:dataPermission:delete']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          text="删除"
          :message="`确认删除规则'${row.ruleName}'吗？`"
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
      content-height="500px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规则名称:" prop="ruleName">
              <el-input v-model="form.ruleName" placeholder="请输入规则名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源类型:" prop="resourceType">
              <el-select v-model="form.resourceType" placeholder="请选择资源类型" style="width: 100%">
                <el-option label="用户" value="user" />
                <el-option label="角色" value="role" />
                <el-option label="部门" value="dept" />
                <el-option label="菜单" value="menu" />
                <el-option label="岗位" value="post" />
                <el-option label="字典" value="dict" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="范围类型:" prop="scopeType">
              <DictSelect v-model="form.scopeType" dict-type="sys_data_scope" placeholder="请选择范围类型" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <DictSelect v-model="form.status" dict-type="sys_normal_disable" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="form.scopeType === '1'" label="选择部门:" prop="deptIds">
          <el-tree-select
            v-model="form.deptIds"
            :data="deptTree"
            :props="{ value: 'id', label: 'deptName', children: 'children' }"
            multiple
            check-strictly
            placeholder="请选择部门"
            clearable
            :style="{ width: '100%' }"
          />
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import {
  getDataPermissionListAPI,
  createDataPermissionAPI,
  updateDataPermissionAPI,
  deleteDataPermissionAPI,
  batchDeleteDataPermissionsAPI,
} from '@/api/dataPermission'
import { getDeptTreeAPI } from '@/api/dept'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'

defineOptions({
  name: 'SystemDataPermissionIndex',
})

// #region 数据定义

const formRef = ref(null)
const deptTree = ref([])

const {
  tableData, loading, total, queryParams, page, limit,
  getData, handlePageChange, handleSizeChange, handleRefresh,
  form, dialogVisible, submitLoading, selectedIds,
  handleAdd, handleEdit, handleSubmit, handleDelete,
  handleSelectionChange, handleBatchDelete,
} = useCrud(
  getDataPermissionListAPI,
  { create: createDataPermissionAPI, update: updateDataPermissionAPI, delete: deleteDataPermissionAPI, batchDelete: batchDeleteDataPermissionsAPI },
  {
    nameField: 'ruleName',
    formDefaults: { ruleName: '', resourceType: '', scopeType: '', deptIds: [], status: 1, remark: '' },
    defaultParams: { ruleName: '', resourceType: '', status: '' },
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑数据权限规则' : '新增数据权限规则'))

const rules = {
  ruleName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
  resourceType: [{ required: true, message: '资源类型不能为空', trigger: 'change' }],
  scopeType: [{ required: true, message: '范围类型不能为空', trigger: 'change' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'ruleName', label: '规则名称', minWidth: 150 },
  { prop: 'resourceType', label: '资源类型', minWidth: 100 },
  { prop: 'scopeType', label: '范围类型', width: 120, align: 'center', slot: 'scopeType' },
  { prop: 'status', label: '状态', width: 120, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 部门树加载

const loadDeptTree = async () => {
  try {
    const res = await getDeptTreeAPI()
    deptTree.value = res || []
  } catch (error) {
    // 错误由 axios 拦截器处理
  }
}

// #endregion

// #region 新增/编辑

const onAdd = () => {
  handleAdd()
  loadDeptTree()
}

const onEdit = (row) => {
  loadDeptTree()
  handleEdit(row)
}

const onSubmit = () => {
  handleSubmit(formRef.value)
}

// #endregion

// #region 监听

watch(
  () => form.value.scopeType,
  (val) => {
    if (val !== '1') {
      form.value.deptIds = []
    }
  }
)

// #endregion
</script>

<style scoped>
.data-permission-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
