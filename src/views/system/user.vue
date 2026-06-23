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
        <el-input v-model="queryParams.userName" placeholder="用户账号" clearable style="width: 200px" />
        <el-input v-model="queryParams.phone" placeholder="手机号码" clearable style="width: 200px" />
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="用户状态"
          clearable
          style="width: 120px"
        />
        <el-button v-permission="['system:user:add']" type="primary" :icon="Plus" @click="onAdd">新增</el-button>
        <el-button
          v-permission="['system:user:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <template #userName="{ row }">
        <span>{{ row.userName }}</span>
      </template>

      <template #status="{ row }">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
      </template>

      <template #operation="{ row }">
        <el-button
          v-permission="['system:user:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="onEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-permission="['system:user:delete']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          @click="handleDelete(row)"
          >删除</el-button
        >
        <el-button
          v-permission="['system:user:resetPwd']"
          v-if="isSuperAdmin"
          type="warning"
          size="small"
          link
          :icon="Key"
          @click="handleResetPassword(row)"
          >重置密码</el-button
        >
        <el-button
          v-permission="['system:user:forceOffline']"
          v-if="isSuperAdmin"
          type="danger"
          size="small"
          link
          :icon="SwitchButton"
          @click="handleForceOffline(row)"
          >强制下线</el-button
        >
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      content-height="500px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="overflow: hidden">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户账号:" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户账号" :disabled="!!form.id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称:" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码:" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户邮箱:" prop="email">
              <el-input v-model="form.email" placeholder="请输入用户邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户性别:" prop="sex">
              <DictSelect
                v-model="form.sex"
                dict-type="sys_user_sex"
                placeholder="请选择用户性别"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色:" prop="roleIds">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width: 100%">
                <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位:" prop="postIds">
              <el-select v-model="form.postIds" multiple placeholder="请选择岗位" style="width: 100%">
                <el-option v-for="item in postList" :key="item.id" :label="item.postName" :value="item.id" />
              </el-select>
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
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :rows="2" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->

    <!-- #region 重置密码确认 -->
    <el-dialog v-if="resetPasswordVisible" v-model="resetPasswordVisible" title="重置密码" width="400px">
      <el-form>
        <el-form-item label="用户账号:">
          <el-input :value="resetPasswordForm.userName" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetPasswordVisible = false">取消</el-button>
          <el-button type="primary" :loading="resetLoading" @click="handleResetPasswordSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { Plus, Edit, Delete, Key, SwitchButton } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
import { useCrud } from '@/hooks'
import { getUserListAPI, createUserAPI, updateUserAPI, deleteUserAPI, batchDeleteUsersAPI } from '@/api/system/user'
import { resetUserPasswordAPI, forceUserOfflineAPI } from '@/api/auth/auth'
import { getDeptTreeAPI } from '@/api/system/dept'
import { getRoleListAPI } from '@/api/system/role'
import { getPostListAPI } from '@/api/system/post'
import { formatDateTime } from '@/utils/date'
import { useUserStore } from '@/store/user'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'

defineOptions({
  name: 'SystemUserIndex',
})

// #region 数据定义

const userStore = useUserStore()
const isSuperAdmin = computed(() => {
  const roles = userStore.roles || []
  return roles.includes('super_admin') || roles.includes('admin')
})

const formRef = ref(null)

const formDefaults = {
  id: '',
  userName: '',
  nickName: '',
  phone: '',
  email: '',
  sex: 0,
  status: 1,
  remark: '',
  deptId: null,
  roleIds: [],
  postIds: [],
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
  getUserListAPI,
  { create: createUserAPI, update: updateUserAPI, delete: deleteUserAPI, batchDelete: batchDeleteUsersAPI },
  {
    nameField: 'userName',
    formDefaults,
    defaultParams: { userName: '', phone: '', status: '' },
    formatFormData: (row) => ({
      ...row,
      deptId: row.deptId || row.dept?.id || null,
      roleIds: (row.roles || []).map((r) => r.id),
      postIds: (row.posts || []).map((p) => p.id),
    }),
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑用户' : '新增用户'))

const rules = {
  userName: [{ required: true, message: '用户账号不能为空', trigger: 'blur' }],
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [{ required: true, message: '用户邮箱不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'userName', label: '用户账号', minWidth: 120, slot: 'userName' },
  { prop: 'nickName', label: '用户昵称', minWidth: 120 },
  { prop: 'dept.deptName', label: '部门', minWidth: 120 },
  { prop: 'phone', label: '手机号码', minWidth: 120 },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 220, align: 'center', fixed: 'right', slot: 'operation' },
]

// 重置密码
const resetPasswordVisible = ref(false)
const resetLoading = ref(false)
const resetPasswordForm = ref({ id: '', userName: '' })

// 部门树、角色列表、岗位列表
const roleList = ref([])
const postList = ref([])

// #endregion

// #region 数据获取

const loadRoleList = async () => {
  try {
    const res = await getRoleListAPI()
    roleList.value = Array.isArray(res) ? res : res?.list || []
  } catch (error) {
    // 错误由 axios 拦截器处理
    console.error('[API Error]', error)
  }
}

const loadPostList = async () => {
  try {
    const res = await getPostListAPI()
    postList.value = Array.isArray(res) ? res : res?.list || []
  } catch (error) {
    // 错误由 axios 拦截器处理
    console.error('[API Error]', error)
  }
}

// #endregion

// #region 新增/编辑

const onAdd = () => {
  handleAdd()
  loadRoleList()
  loadPostList()
}

const onEdit = async (row) => {
  await Promise.all([loadRoleList(), loadPostList()])
  await nextTick()
  handleEdit(row)
}

const onSubmit = () => {
  handleSubmit(formRef.value)
}

// #endregion

// #region 重置密码

const handleResetPassword = (row) => {
  resetPasswordForm.value = { id: row.id, userName: row.userName }
  resetPasswordVisible.value = true
}

const handleResetPasswordSubmit = async () => {
  resetLoading.value = true
  try {
    await resetUserPasswordAPI(resetPasswordForm.value.id)
    ElMessage.success('密码重置成功，新密码为：123456')
    resetPasswordVisible.value = false
  } catch (error) {
    // 错误由 axios 拦截器处理
    console.error('[API Error]', error)
  } finally {
    resetLoading.value = false
  }
}

const handleForceOffline = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要强制用户"${row.userName}"下线吗？此操作仅超级管理员可用！`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await forceUserOfflineAPI(row.id)
    ElMessage.success('用户已强制下线')
  } catch (error) {
    if (error !== 'cancel') {
      // 错误由 axios 拦截器处理
      console.error('[API Error]', error)
    }
  }
}

// #endregion
</script>
