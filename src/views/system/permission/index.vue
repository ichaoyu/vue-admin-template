<template>
  <div class="permission-container">
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
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 操作类型 -->
      <template #actionType="{ row }">
        <DictTag :value="row.actionType" dict-type="sys_action_type" />
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <status-switch
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
        <el-button type="primary" size="small" link :icon="View" @click="handleView(row)"> 详情 </el-button>
        <el-button type="primary" size="small" link :icon="Edit" @click="handleEdit(row)"> 编辑 </el-button>
        <confirm-button
          type="danger"
          size="small"
          link
          :icon="Delete"
          text="删除"
          message="确认删除该权限吗？"
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
      content-height="550px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit"
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
        <el-form-item label="权限描述:" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入权限描述" :rows="2" clearable />
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
        <el-form-item label="租户 ID:" prop="tenantId">
          <el-input v-model="form.tenantId" placeholder="请输入租户 ID（可选）" clearable />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->

    <!-- #region 详情弹窗 -->
    <pro-dialog v-if="detailVisible" v-model="detailVisible" title="权限详情" width="600px" content-height="500px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="权限 ID">
          {{ detailData.id }}
        </el-descriptions-item>
        <el-descriptions-item label="权限名称">
          {{ detailData.permissionName }}
        </el-descriptions-item>
        <el-descriptions-item label="权限编码">
          {{ detailData.permissionCode }}
        </el-descriptions-item>
        <el-descriptions-item label="权限描述">
          {{ detailData.remark || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="资源 ID">
          {{ detailData.resourceId }}
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <DictTag :value="detailData.actionType" dict-type="sys_action_type" />
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <DictTag :value="detailData.status" dict-type="sys_normal_disable" />
        </el-descriptions-item>
        <el-descriptions-item label="租户 ID">
          {{ detailData.tenantId || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDateTime(detailData.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDateTime(detailData.updateTime) }}
        </el-descriptions-item>
      </el-descriptions>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Plus, Edit, Delete, View, InfoFilled } from '@element-plus/icons-vue'
import {
  getPermissionListAPI,
  getPermissionDetailAPI,
  createPermissionAPI,
  updatePermissionAPI,
  deletePermissionAPI,
  batchDeletePermissionsAPI,
} from '@/api/permission'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import DictTag from '@/components/DictTag/index.vue'

defineOptions({
  name: 'SystemPermissionIndex',
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
  permissionName: '',
  permissionCode: '',
  resourceId: '',
  actionType: '',
  status: '',
})

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑权限' : '新增权限'))
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: '',
  permissionName: '',
  permissionCode: '',
  remark: '',
  resourceId: '',
  actionType: 0,
  status: 1,
  tenantId: '',
})

const rules = {
  permissionName: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
  permissionCode: [{ required: true, message: '权限编码不能为空', trigger: 'blur' }],
  remark: [{ required: true, message: '权限描述不能为空', trigger: 'blur' }],
  resourceId: [{ required: true, message: '资源 ID 不能为空', trigger: 'blur' }],
  actionType: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'permissionName', label: '权限名称', minWidth: 150 },
  { prop: 'permissionCode', label: '权限编码', minWidth: 180 },
  { prop: 'resourceId', label: '资源 ID', minWidth: 120 },
  { prop: 'actionType', label: '操作类型', width: 100, align: 'center', slot: 'actionType' },
  { prop: 'status', label: '状态', width: 120, align: 'center', slot: 'status' },
  { prop: 'remark', label: '描述', minWidth: 200 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 200, align: 'center', fixed: 'right', slot: 'operation' },
]

const detailVisible = ref(false)
const detailData = ref({})

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getPermissionListAPI(queryParams)
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取权限列表失败:', error)
    ElMessage.error('获取权限列表失败')
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
    permissionName: row.permissionName,
    permissionCode: row.permissionCode,
    remark: row.remark,
    resourceId: row.resourceId,
    actionType: row.actionType,
    status: row.status,
    tenantId: row.tenantId || '',
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (form.id) {
        await updatePermissionAPI(form.id, form)
        ElMessage.success('修改成功')
      } else {
        await createPermissionAPI(form)
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
    permissionName: '',
    permissionCode: '',
    remark: '',
    resourceId: '',
    actionType: 0,
    status: 1,
    tenantId: '',
  })
}

// #endregion

// #region 删除

const handleDelete = async (row) => {
  try {
    await deletePermissionAPI(row.id)
    ElMessage.success('删除成功')
    getData()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的权限')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 个权限吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeletePermissionsAPI(selectedIds.value)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  })
}

// #endregion

// #region 查看详情

const handleView = async (row) => {
  try {
    const res = await getPermissionDetailAPI(row.id)
    detailData.value = res || {}
    detailVisible.value = true
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  }
}

// #endregion

// #region 生命周期

onMounted(() => {
  getData()
})

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
