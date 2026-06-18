<template>
  <div class="dynamic-permission-container">
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
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.ruleName" placeholder="规则名称" clearable style="width: 150px" />
        <el-input v-model="queryParams.resourceCode" placeholder="资源编码" clearable style="width: 150px" />
        <el-select v-model="queryParams.resourceType" placeholder="资源类型" clearable style="width: 120px">
          <el-option label="菜单" :value="0" />
          <el-option label="按钮" :value="1" />
          <el-option label="API" :value="2" />
          <el-option label="数据" :value="3" />
        </el-select>
        <dict-select
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="状态"
          style="width: 120px"
        />
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- #region 资源类型 -->
      <template #resourceType="{ row }">
        <el-tag v-if="row.resourceType === 0" type="warning">用户</el-tag>
        <el-tag v-else-if="row.resourceType === 1" type="primary">角色</el-tag>
        <el-tag v-else-if="row.resourceType === 2" type="success">部门</el-tag>
        <el-tag v-else-if="row.resourceType === 3" type="danger">菜单</el-tag>
        <el-tag v-else type="info">其他</el-tag>
      </template>
      <!-- #endregion -->

      <!-- #region 权限类型 -->
      <template #permissionType="{ row }">
        <el-tag v-if="row.permissionType === 0" type="info">读权限</el-tag>
        <el-tag v-else-if="row.permissionType === 1" type="warning">写权限</el-tag>
        <el-tag v-else-if="row.permissionType === 2" type="danger">删除权限</el-tag>
        <el-tag v-else type="success">全部权限</el-tag>
      </template>
      <!-- #endregion -->

      <!-- #region 规则动作 -->
      <template #ruleAction="{ row }">
        <el-tag v-if="row.ruleAction === 0" type="success">允许</el-tag>
        <el-tag v-else type="danger">拒绝</el-tag>
      </template>
      <!-- #endregion -->

      <!-- #region 状态 -->
      <template #status="{ row }">
        <status-switch
          v-model="row.status"
          :id="row.id"
          :api="updateStatusAPI"
          :active-value="1"
          :inactive-value="0"
          active-text="正常"
          inactive-text="停用"
        />
      </template>
      <!-- #endregion -->

      <!-- #region 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" size="small" link :icon="Edit" @click="handleEdit(row)"> 编辑 </el-button>
        <el-button
          type="success"
          size="small"
          link
          :icon="CircleCheck"
          :disabled="row.status === 0"
          @click="handleEnable(row)"
        >
          启用
        </el-button>
        <el-button
          type="warning"
          size="small"
          link
          :icon="CircleClose"
          :disabled="row.status === 1"
          @click="handleDisable(row)"
        >
          停用
        </el-button>
        <confirm-button
          type="danger"
          size="small"
          link
          :icon="Delete"
          text="删除"
          message="确认删除该动态权限规则吗？"
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
      width="700px"
      content-height="600px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="规则名称:" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输入规则名称" clearable />
        </el-form-item>
        <el-form-item label="资源类型:" prop="resourceType">
          <el-select v-model="form.resourceType" placeholder="请选择资源类型" style="width: 100%">
            <el-option label="菜单" :value="0" />
            <el-option label="按钮" :value="1" />
            <el-option label="API" :value="2" />
            <el-option label="数据" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源编码:" prop="resourceCode">
          <el-input v-model="form.resourceCode" placeholder="请输入资源编码" clearable />
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            资源的唯一编码标识，如：system:user:add
          </div>
        </el-form-item>
        <el-form-item label="权限类型:" prop="permissionType">
          <el-select v-model="form.permissionType" placeholder="请选择权限类型" style="width: 100%">
            <el-option label="部门级" :value="0" />
            <el-option label="角色级" :value="1" />
            <el-option label="用户级" :value="2" />
            <el-option label="数据级" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则条件:" prop="ruleCondition">
          <el-input
            v-model="form.ruleCondition"
            type="textarea"
            :rows="4"
            placeholder='请输入 JSON 格式的规则条件，如：{"deptId": "1"}'
            @blur="validateJson"
          />
          <div v-if="jsonError" class="form-tip error">
            <el-icon><WarningFilled /></el-icon>
            {{ jsonError }}
          </div>
        </el-form-item>
        <el-form-item label="规则动作:" prop="ruleAction">
          <el-select v-model="form.ruleAction" placeholder="请选择规则动作" style="width: 100%">
            <el-option label="允许" :value="0" />
            <el-option label="拒绝" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级:" prop="priority">
          <el-input-number v-model="form.priority" :min="0" :max="999" :step="1" style="width: 100%" />
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            优先级数字，越小优先级越高
          </div>
        </el-form-item>
        <el-form-item label="开始时间:" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <dict-select v-model="form.status" dict-type="sys_normal_disable" />
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入规则描述" clearable />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete, CircleCheck, CircleClose, InfoFilled, WarningFilled } from '@element-plus/icons-vue'
import {
  getDynamicPermissionListAPI,
  getDynamicPermissionDetailAPI,
  createDynamicPermissionAPI,
  updateDynamicPermissionAPI,
  deleteDynamicPermissionAPI,
  batchDeleteDynamicPermissionAPI,
  enableDynamicPermissionAPI,
  disableDynamicPermissionAPI,
} from '@/api/dynamicPermission'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'

defineOptions({
  name: 'SystemDynamicPermissionIndex',
})

// #region 数据定义

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedIds = ref([])

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  ruleName: '',
  resourceCode: '',
  resourceType: '',
  status: '',
})

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑动态权限规则' : '新增动态权限规则'))
const submitLoading = ref(false)
const formRef = ref(null)
const jsonError = ref('')

const form = reactive({
  id: '',
  ruleName: '',
  resourceType: 0,
  resourceCode: '',
  permissionType: 0,
  ruleCondition: '',
  ruleAction: 0,
  priority: 100,
  startTime: '',
  endTime: '',
  status: 1,
  description: '',
})

const rules = {
  ruleName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
  resourceType: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
  resourceCode: [{ required: true, message: '资源编码不能为空', trigger: 'blur' }],
  permissionType: [{ required: true, message: '请选择权限类型', trigger: 'change' }],
  ruleCondition: [
    { required: true, message: '规则条件不能为空', trigger: 'blur' },
    { validator: validateJsonRule, trigger: 'blur' },
  ],
  ruleAction: [{ required: true, message: '请选择规则动作', trigger: 'change' }],
  priority: [{ required: true, message: '请输入优先级', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'ruleName', label: '规则名称', minWidth: 150 },
  { prop: 'resourceCode', label: '资源编码', minWidth: 180 },
  { prop: 'resourceType', label: '资源类型', width: 100, align: 'center', slot: 'resourceType' },
  { prop: 'permissionType', label: '权限类型', width: 100, align: 'center', slot: 'permissionType' },
  { prop: 'ruleAction', label: '规则动作', width: 100, align: 'center', slot: 'ruleAction' },
  { prop: 'priority', label: '优先级', width: 80, align: 'center' },
  { prop: 'status', label: '状态', width: 120, align: 'center', slot: 'status' },
  { prop: 'description', label: '描述', minWidth: 200 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 280, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 工具方法

/**
 * 验证 JSON 格式
 */
const validateJson = () => {
  if (!form.ruleCondition) {
    jsonError.value = ''
    return
  }
  try {
    JSON.parse(form.ruleCondition)
    jsonError.value = ''
  } catch (e) {
    jsonError.value = 'JSON 格式不正确，请检查'
  }
}

/**
 * 自定义验证器 - JSON 格式
 */
function validateJsonRule(rule, value, callback) {
  if (!value) {
    callback(new Error('规则条件不能为空'))
    return
  }
  try {
    JSON.parse(value)
    callback()
  } catch (e) {
    callback(new Error('JSON 格式不正确，请检查'))
  }
}

/**
 * 更新状态的 API 适配器
 * @param {string} id - 规则 ID
 * @param {number} status - 状态
 */
const updateStatusAPI = async (id, status) => {
  if (status === 0) {
    return await enableDynamicPermissionAPI(id)
  } else {
    return await disableDynamicPermissionAPI(id)
  }
}

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getDynamicPermissionListAPI(queryParams)
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取动态权限列表失败:', error)
    ElMessage.error('获取动态权限列表失败')
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
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

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// #endregion

// #region 新增/编辑

const handleAdd = () => {
  resetForm()
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  try {
    const res = await getDynamicPermissionDetailAPI(row.id)
    const data = res || row
    Object.assign(form, {
      id: data.id,
      ruleName: data.ruleName,
      resourceType: data.resourceType,
      resourceCode: data.resourceCode,
      permissionType: data.permissionType,
      ruleCondition: data.ruleCondition || '',
      ruleAction: data.ruleAction,
      priority: data.priority,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status,
      description: data.description || '',
    })
    dialogVisible.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  // 先验证 JSON 格式
  validateJson()
  if (jsonError.value) {
    ElMessage.error('规则条件 JSON 格式不正确，请修正后再提交')
    return
  }

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      const submitData = {
        ruleName: form.ruleName,
        resourceType: form.resourceType,
        resourceCode: form.resourceCode,
        permissionType: form.permissionType,
        ruleCondition: form.ruleCondition,
        ruleAction: form.ruleAction,
        priority: form.priority,
        startTime: form.startTime,
        endTime: form.endTime,
        status: form.status,
        description: form.description,
      }

      if (form.id) {
        await updateDynamicPermissionAPI(form.id, submitData)
        ElMessage.success('修改成功')
      } else {
        await createDynamicPermissionAPI(submitData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      getData()
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      submitLoading.value = false
    }
  })
}

const resetForm = () => {
  Object.assign(form, {
    id: '',
    ruleName: '',
    resourceType: 0,
    resourceCode: '',
    permissionType: 0,
    ruleCondition: '',
    ruleAction: 0,
    priority: 100,
    startTime: '',
    endTime: '',
    status: 1,
    description: '',
  })
  jsonError.value = ''
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// #endregion

// #region 启用/停用

const handleEnable = async (row) => {
  try {
    await enableDynamicPermissionAPI(row.id)
    ElMessage.success('启用成功')
    getData()
  } catch (error) {
    console.error('启用失败:', error)
  }
}

const handleDisable = async (row) => {
  try {
    await disableDynamicPermissionAPI(row.id)
    ElMessage.success('停用成功')
    getData()
  } catch (error) {
    console.error('停用失败:', error)
  }
}

// #endregion

// #region 删除

const handleDelete = async (row) => {
  try {
    await deleteDynamicPermissionAPI(row.id)
    ElMessage.success('删除成功')
    getData()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的规则')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 个规则吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteDynamicPermissionAPI(selectedIds.value)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('批量删除失败:', error)
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
.dynamic-permission-container {
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

.form-tip.error {
  color: #f56c6c;
}
</style>
