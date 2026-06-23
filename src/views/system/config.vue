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
        <el-input v-model="queryParams.configName" placeholder="参数名称" clearable style="width: 200px" />
        <el-input v-model="queryParams.configKey" placeholder="参数键名" clearable style="width: 200px" />
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="参数状态"
          clearable
          style="width: 120px"
        />
        <el-button v-permission="['system:config:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button
          v-permission="['system:config:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>
      <template #configType="{ row }">
        <DictTag :value="row.configType" dict-type="sys_yes_no" />
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <StatusSwitch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button
          v-permission="['system:config:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-permission="['system:config:delete']"
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
      content-height="320px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit(formRef)"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="参数名称:" prop="configName">
          <el-input v-model="form.configName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名:" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值:" prop="configValue">
          <el-input v-model="form.configValue" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="系统内置:" prop="configType">
          <el-radio-group v-model="form.configType">
            <el-radio value="Y">是</el-radio>
            <el-radio value="N">否</el-radio>
          </el-radio-group>
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
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import {
  getConfigListAPI,
  createConfigAPI,
  updateConfigAPI,
  deleteConfigAPI,
  batchDeleteConfigsAPI,
} from '@/api/system/config'
import { formatDateTime } from '@/utils/date'
import { useCrud } from '@/hooks'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import DictTag from '@/components/DictTag/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'

defineOptions({
  name: 'SystemConfigIndex',
})

// #region useCrud

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
  handleStatusChange,
  handleSelectionChange,
  handleBatchDelete,
} = useCrud(
  getConfigListAPI,
  {
    create: createConfigAPI,
    update: updateConfigAPI,
    delete: deleteConfigAPI,
    batchDelete: batchDeleteConfigsAPI,
  },
  {
    nameField: 'configName',
    formDefaults: {
      configName: '',
      configKey: '',
      configValue: '',
      configType: '',
      sort: 0,
      status: 1,
      remark: '',
    },
    defaultParams: {
      configName: '',
      configKey: '',
      status: '',
    },
  }
)

// #endregion

// #region 表单与校验

const formRef = ref(null)

const dialogTitle = computed(() => (form.value.id ? '编辑参数' : '新增参数'))

const rules = {
  configName: [{ required: true, message: '参数名称不能为空', trigger: 'blur' }],
  configKey: [{ required: true, message: '参数键名不能为空', trigger: 'blur' }],
  configValue: [{ required: true, message: '参数键值不能为空', trigger: 'blur' }],
}

// #endregion

// #region 表格列定义

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '#', width: 60, align: 'center' },
  { prop: 'configName', label: '参数名称', minWidth: 150 },
  { prop: 'configKey', label: '参数键名', minWidth: 150 },
  { prop: 'configValue', label: '参数键值', minWidth: 150 },
  { prop: 'configType', label: '系统内置', width: 100, align: 'center', slot: 'configType' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #endregion
</script>
