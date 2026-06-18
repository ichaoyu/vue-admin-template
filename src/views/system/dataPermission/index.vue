<template>
  <div class="data-permission-container">
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
          style="width: 120px"
        />
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 规则条件 -->
      <template #ruleCondition="{ row }">
        <el-tooltip :content="row.ruleCondition" placement="top">
          <el-tag type="info" size="small">{{ formatCondition(row.ruleCondition) }}</el-tag>
        </el-tooltip>
      </template>

      <!-- 规则动作 -->
      <template #ruleAction="{ row }">
        <el-tag v-if="row.ruleAction === 0 || row.ruleAction === '0'" type="success" size="small">允许</el-tag>
        <el-tag v-else type="danger" size="small">拒绝</el-tag>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <DictTag :value="row.status" dict-type="sys_normal_disable" size="small" />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" size="small" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
        <ConfirmButton
          type="danger"
          size="small"
          link
          text="删除"
          :message="`确认删除规则${row.ruleName}吗？`"
          :on-confirm="() => handleDelete(row)"
          success-message="删除成功"
          @confirm="getData"
        />
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      content-height="550px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit"
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
            <el-form-item label="资源编码:" prop="resourceCode">
              <el-input v-model="form.resourceCode" placeholder="请输入资源编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限类型:" prop="permissionType">
              <el-select v-model="form.permissionType" placeholder="请选择权限类型" style="width: 100%">
                <el-option label="读权限" value="read" />
                <el-option label="写权限" value="write" />
                <el-option label="删除权限" value="delete" />
                <el-option label="全部权限" value="all" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规则动作:" prop="ruleAction">
              <el-select v-model="form.ruleAction" placeholder="请选择规则动作" style="width: 100%">
                <el-option label="允许" value="0" />
                <el-option label="拒绝" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级:" prop="priority">
              <el-input-number v-model="form.priority" :min="0" :max="999" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <DictSelect v-model="form.status" dict-type="sys_normal_disable" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="规则条件:" prop="ruleCondition">
          <el-input
            v-model="form.ruleCondition"
            type="textarea"
            :rows="4"
            placeholder='请输入 JSON 格式的规则条件，如：{"deptId": "1"}'
          />
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入规则描述" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit } from '@element-plus/icons-vue'
import {
  getDataPermissionListAPI,
  createDataPermissionAPI,
  updateDataPermissionAPI,
  deleteDataPermissionAPI,
  batchDeleteDataPermissionsAPI,
} from '@/api/dataPermission'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'

defineOptions({
  name: 'SystemDataPermissionIndex',
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
  resourceType: '',
  status: '',
})

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑数据权限规则' : '新增数据权限规则'))
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: '',
  ruleName: '',
  resourceType: '',
  resourceCode: '',
  permissionType: '',
  ruleCondition: '',
  ruleAction: 0,
  priority: 0,
  status: 1,
  description: '',
})

const rules = {
  ruleName: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
  resourceType: [{ required: true, message: '资源类型不能为空', trigger: 'change' }],
  resourceCode: [{ required: true, message: '资源编码不能为空', trigger: 'blur' }],
  permissionType: [{ required: true, message: '权限类型不能为空', trigger: 'change' }],
  ruleCondition: [
    { required: true, message: '规则条件不能为空', trigger: 'blur' },
    { validator: validateJson, trigger: 'blur' },
  ],
  ruleAction: [{ required: true, message: '规则动作不能为空', trigger: 'change' }],
  priority: [{ required: true, message: '优先级不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'ruleName', label: '规则名称', minWidth: 150 },
  { prop: 'resourceType', label: '资源类型', minWidth: 100 },
  { prop: 'resourceCode', label: '资源编码', minWidth: 120 },
  { prop: 'permissionType', label: '权限类型', minWidth: 100 },
  { prop: 'ruleCondition', label: '规则条件', minWidth: 200, slot: 'ruleCondition' },
  { prop: 'ruleAction', label: '规则动作', width: 90, align: 'center', slot: 'ruleAction' },
  { prop: 'priority', label: '优先级', width: 80, align: 'center' },
  { prop: 'status', label: '状态', width: 80, align: 'center', slot: 'status' },
  { prop: 'description', label: '描述', minWidth: 180, showOverflowTooltip: true },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region JSON 验证器

/**
 * 验证 JSON 格式
 * @param {any} rule - 验证规则
 * @param {string} value - 验证值
 * @param {Function} callback - 回调函数
 */
function validateJson(rule, value, callback) {
  if (!value) {
    callback(new Error('规则条件不能为空'))
    return
  }

  try {
    JSON.parse(value)
    callback()
  } catch (e) {
    callback(new Error('规则条件必须是有效的 JSON 格式'))
  }
}

// #endregion

// #region 工具函数

/**
 * 格式化规则条件显示
 * @param {string} condition - 规则条件
 * @returns {string} 格式化后的字符串
 */
function formatCondition(condition) {
  if (!condition) return ''
  try {
    const obj = JSON.parse(condition)
    const keys = Object.keys(obj)
    if (keys.length === 0) return '{}'
    if (keys.length <= 2) {
      return JSON.stringify(obj)
    }
    return `{${keys.length} 个条件}`
  } catch {
    return condition
  }
}

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getDataPermissionListAPI(queryParams)
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取数据权限规则列表失败:', error)
    ElMessage.error('获取数据失败')
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

const handleEdit = (row) => {
  Object.assign(form, {
    id: row.id,
    ruleName: row.ruleName,
    resourceType: row.resourceType,
    resourceCode: row.resourceCode,
    permissionType: row.permissionType,
    ruleCondition: row.ruleCondition,
    ruleAction: row.ruleAction,
    priority: row.priority,
    status: row.status,
    description: row.description,
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      // 解析 JSON 字符串
      const submitData = {
        ...form,
        ruleCondition: JSON.parse(form.ruleCondition),
        priority: Number(form.priority),
      }

      if (form.id) {
        await updateDataPermissionAPI(form.id, submitData)
        ElMessage.success('修改成功')
      } else {
        await createDataPermissionAPI(submitData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      getData()
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error(error?.message || '操作失败')
    } finally {
      submitLoading.value = false
    }
  })
}

const resetForm = () => {
  Object.assign(form, {
    id: '',
    ruleName: '',
    resourceType: '',
    resourceCode: '',
    permissionType: '',
    ruleCondition: '',
    ruleAction: 0,
    priority: 0,
    status: 1,
    description: '',
  })
  formRef.value?.resetFields?.()
}

// #endregion

// #region 删除

const handleDelete = async (row) => {
  try {
    await deleteDataPermissionAPI(row.id)
    ElMessage.success('删除成功')
    getData()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
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
      await batchDeleteDataPermissionsAPI(selectedIds.value)
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
.data-permission-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
