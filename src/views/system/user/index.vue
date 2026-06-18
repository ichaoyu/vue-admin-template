<template>
  <div class="user-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="queryParams.pageNum"
      :limit="queryParams.pageSize"
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
        <!-- 新增按钮：需要 system:user:add 权限 -->
        <el-button v-permission="['system:user:add']" type="primary" :icon="Plus" @click="handleAdd"> 新增 </el-button>
        <!-- 批量删除按钮 -->
        <el-button
          v-permission="['system:user:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 用户名 -->
      <template #userName="{ row }">
        <span>{{ row.userName }}</span>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <!-- 编辑按钮：需要 system:user:edit 权限 -->
        <el-button
          v-permission="['system:user:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
        >
          编辑
        </el-button>
        <!-- 删除按钮：需要 system:user:delete 权限 -->
        <el-button
          v-permission="['system:user:delete']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
        <!-- 重置密码按钮：需要 system:user:resetPwd 权限 -->
        <el-button
          v-permission="['system:user:resetPwd']"
          v-if="isSuperAdmin"
          type="warning"
          size="small"
          link
          :icon="Key"
          @click="handleResetPassword(row)"
        >
          重置密码
        </el-button>
        <!-- 强制下线按钮：需要 system:user:forceOffline 权限 -->
        <el-button
          v-permission="['system:user:forceOffline']"
          v-if="isSuperAdmin"
          type="danger"
          size="small"
          link
          :icon="SwitchButton"
          @click="handleForceOffline(row)"
        >
          强制下线
        </el-button>
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
      @confirm="handleSubmit"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Key, SwitchButton } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
import {
  getUserListAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
  batchDeleteUsersAPI,
  resetUserPasswordAPI,
  forceUserOfflineAPI,
} from '@/api/user'
import { getDeptTreeAPI } from '@/api/dept'
import { getRoleListAPI } from '@/api/role'
import { getPostListAPI } from '@/api/post'
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

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedIds = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  phone: '',
  status: '',
})

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑用户' : '新增用户'))
const submitLoading = ref(false)
const formRef = ref(null)
const form = reactive({
  id: '',
  userName: '',
  password: '',
  nickName: '',
  phone: '',
  email: '',
  sex: 0,
  status: 1,
  remark: '',
  deptId: null,
  roleIds: [],
  postIds: [],
})

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
const resetPasswordForm = reactive({
  id: '',
  userName: '',
})

// 部门树、角色列表、岗位列表
const deptTree = ref([])
const roleList = ref([])
const postList = ref([])

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getUserListAPI(queryParams)
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const loadDeptTree = async () => {
  try {
    const res = await getDeptTreeAPI()
    deptTree.value = res?.data || res || []
  } catch (error) {
    console.error('获取部门树失败:', error)
  }
}

const loadRoleList = async () => {
  try {
    const res = await getRoleListAPI()
    roleList.value = res?.list || res?.data || res || []
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

const loadPostList = async () => {
  try {
    const res = await getPostListAPI()
    postList.value = res?.list || res?.data || res || []
  } catch (error) {
    console.error('获取岗位列表失败:', error)
  }
}

const handleRefresh = () => {
  getData()
}

const handlePageChange = (page) => {
  queryParams.pageNum = page
  getData()
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNum = 1
  getData()
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// #endregion

// #region 新增/编辑

const handleAdd = () => {
  resetForm()
  loadDeptTree()
  loadRoleList()
  loadPostList()
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  resetForm()

  // 先加载所需的基础数据
  await Promise.all([loadDeptTree(), loadRoleList(), loadPostList()])

  // 等待 DOM 更新后再赋值
  await nextTick()

  // 填充表单数据
  Object.assign(form, {
    id: row.id,
    userName: row.userName,
    nickName: row.nickName,
    phone: row.phone,
    email: row.email,
    sex: row.sex || 0,
    status: row.status || 0,
    remark: row.remark || '',
    deptId: row.deptId || row.dept?.id || null,
    roleIds: (row.roles || []).map((r) => r.id),
    postIds: (row.posts || []).map((p) => p.id),
  })

  console.log('[用户编辑] 表单数据:', {
    id: form.id,
    roleIds: form.roleIds,
    postIds: form.postIds,
  })
  console.log('[用户编辑] 角色列表:', roleList.value)
  console.log('[用户编辑] 岗位列表:', postList.value)

  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (form.id) {
        await updateUserAPI(form.id, form)
        ElMessage.success('修改成功')
      } else {
        await createUserAPI(form)
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
  })
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除用户"${row.userName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteUserAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的用户')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 个用户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteUsersAPI(selectedIds.value)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  })
}

// #endregion

// #region 状态切换

const handleStatusChange = async (row) => {
  const id = row.id
  if (!id) {
    row.status = row.status === 0 ? 1 : 0
    return
  }
  try {
    await updateUserAPI(id, { status: row.status })
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = row.status === 0 ? 1 : 0
    console.error('状态更新失败:', error)
  }
}

// #endregion

// #region 重置密码

const handleResetPassword = (row) => {
  Object.assign(resetPasswordForm, {
    id: row.id,
    userName: row.userName,
  })
  resetPasswordVisible.value = true
}

const handleResetPasswordSubmit = async () => {
  resetLoading.value = true
  try {
    await resetUserPasswordAPI(resetPasswordForm.id)
    ElMessage.success('密码重置成功，新密码为：123456')
    resetPasswordVisible.value = false
  } catch (error) {
    console.error('密码重置失败:', error)
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
  } catch {
    return
  }

  try {
    await forceUserOfflineAPI(row.id)
    ElMessage.success('用户已强制下线')
  } catch (error) {
    console.error('强制下线失败:', error)
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
.user-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
