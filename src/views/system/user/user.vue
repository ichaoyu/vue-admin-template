<template>
  <page-container :title="meta.title" class="table-container">
    <template #header-left>
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
      <el-input
        v-model="searchForm.userName"
        placeholder="请输入用户名"
        clearable
        style="width: 200px; margin-right: 10px"
      />
      <el-input
        v-model="searchForm.nickName"
        placeholder="请输入昵称"
        clearable
        style="width: 200px; margin-right: 10px"
      />
      <el-input
        v-model="searchForm.phone"
        placeholder="请输入手机号"
        clearable
        style="width: 200px; margin-right: 10px"
      />
      <el-button type="primary" @click="fetchTableList">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </template>
    <Table
      :columns="columns"
      :data="data"
      selection
      :action="operator"
      :actionConfig="{
        width: 250,
      }"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pagination="{ defaultPageSize: 50, total }"
      @page-change="onPageChange"
      @batch-delete="handleBatchDelete"
      class="common-table"
      v-loading="loading"
    />

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      destroy-on-close
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="userForm.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!dialogType.edit">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          v-if="!dialogType.edit"
        >
          <el-input
            v-model="userForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userForm.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-select
            v-model="userForm.deptId"
            placeholder="请选择部门"
            style="width: 100%"
          >
            <el-option
              v-for="dept in deptList"
              :key="dept.id"
              :label="dept.deptName"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="停用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="userForm.remark"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="分配角色"
      width="50%"
      destroy-on-close
    >
      <el-form>
        <el-form-item label="用户角色">
          <el-checkbox-group v-model="selectedRoles">
            <el-checkbox
              v-for="role in roleList"
              :key="role.id"
              :label="role.id"
              :disabled="role.id === 1"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAssignRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </page-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import {
  getUserListApi,
  addUserApi,
  editUserApi,
  deleteUserApi,
  batchDeleteUserApi,
  changeUserStatusApi,
  getUserRoleListApi,
  getUserRoleApi,
  assignUserRoleApi,
  getDeptListApi,
} from '@/api/user.api';
import Table from '@/components/Table';
import Columns from './user.columns';

const { name, meta } = useRoute();

// 响应式数据
const data = ref([]);
const columns = Columns;
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 搜索表单
const searchForm = ref({
  userName: '',
  nickName: '',
  phone: '',
});

// 对话框相关
const dialogVisible = ref(false);
const roleDialogVisible = ref(false);
const userFormRef = ref();
const dialogType = ref({ add: true, edit: false });
const dialogTitle = computed(() =>
  dialogType.value.add ? '新增用户' : '编辑用户',
);

// 用户表单
const userForm = ref({
  id: null,
  userName: '',
  nickName: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: '',
  sex: '0',
  deptId: null,
  status: 0,
  remark: '',
});

// 角色相关
const roleList = ref([]);
const selectedRoles = ref([]);
const currentUserId = ref(null);

// 部门列表
const deptList = ref([]);

// 表单验证规则
const userRules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '用户名长度在 2 到 20 个字符',
      trigger: 'blur',
    },
  ],
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: dialogType.value.add, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: dialogType.value.add, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== userForm.value.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  email: [
    {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
};

// 操作按钮配置
const operator = [
  {
    text: '查看',
    action: handleView,
    btnStyle: {
      type: 'primary',
      link: true,
      text: false,
      icon: 'View',
    },
  },
  {
    text: '编辑',
    action: handleEdit,
    btnStyle: {
      type: 'warning',
      link: true,
      text: false,
      icon: 'Edit',
    },
  },
  {
    text: '删除',
    action: handleDelete,
    btnStyle: {
      type: 'danger',
      link: true,
      text: false,
      icon: 'Delete',
    },
  },
  {
    text: '角色分配',
    action: handleAssignRoleClick,
    btnStyle: {
      type: 'info',
      link: true,
      text: false,
      icon: 'User',
    },
  },
  {
    text: '状态',
    action: handleStatusChange,
    btnStyle: {
      type: 'success',
      link: true,
      text: false,
      icon: 'Refresh',
    },
  },
];

// 生命周期钩子
onMounted(() => {
  fetchTableList();
  fetchDeptList();
  fetchRoleList();
});

// 获取用户列表
const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getUserListApi({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value,
    });
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取部门列表
const fetchDeptList = async () => {
  try {
    const res = await getDeptListApi();
    deptList.value = res;
  } catch (err) {
    console.error(err);
  }
};

// 获取角色列表
const fetchRoleList = async () => {
  try {
    const res = await getUserRoleListApi({ roleName: '' });
    roleList.value = res;
  } catch (err) {
    console.error(err);
  }
};

// 分页
const onPageChange = ({ page, size }) => {
  currentPage.value = page ?? currentPage.value;
  pageSize.value = size ?? pageSize.value;
  fetchTableList();
};

// 新增用户
const handleAdd = () => {
  dialogType.value = { add: true, edit: false };
  resetForm();
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row) => {
  dialogType.value = { add: false, edit: true };
  userForm.value = { ...row };
  dialogVisible.value = true;
};

// 查看用户
const handleView = (row) => {
  handleEdit(row);
  // 查看模式可以禁用表单
  // userFormRef.value?.$el.querySelectorAll('input, select, textarea, .el-switch').forEach(el => {
  //   el.disabled = true;
  // });
};

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteUserApi(row.id);
        ElMessage.success('删除成功');
        fetchTableList();
      } catch (err) {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 批量删除用户
const handleBatchDelete = (selections) => {
  if (selections.length === 0) {
    ElMessage.warning('请选择要删除的用户');
    return;
  }
  ElMessageBox.confirm('确定要批量删除所选用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await batchDeleteUserApi({ ids: selections.map((item) => item.id) });
        ElMessage.success('批量删除成功');
        fetchTableList();
      } catch (err) {
        ElMessage.error('批量删除失败');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 修改用户状态
const handleStatusChange = (row) => {
  const newStatus = row.status === 0 ? 1 : 0;
  ElMessageBox.confirm(
    `确定要${newStatus === 0 ? '启用' : '停用'}该用户吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        await changeUserStatusApi({ id: row.id, status: newStatus });
        ElMessage.success('状态修改成功');
        fetchTableList();
      } catch (err) {
        ElMessage.error('状态修改失败');
      }
    })
    .catch(() => {
      // 取消修改
    });
};

// 角色分配点击
const handleAssignRoleClick = (row) => {
  currentUserId.value = row.id;
  fetchUserRole(row.id);
};

// 获取用户角色
const fetchUserRole = async (userId) => {
  try {
    const res = await getUserRoleApi(userId);
    selectedRoles.value = res.map((item) => item.id);
    roleDialogVisible.value = true;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取用户角色失败');
  }
};

// 分配角色
const handleAssignRole = async () => {
  try {
    await assignUserRoleApi({
      userId: currentUserId.value,
      roleIds: selectedRoles.value,
    });
    ElMessage.success('角色分配成功');
    roleDialogVisible.value = false;
  } catch (err) {
    console.error(err);
    ElMessage.error('角色分配失败');
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return;
  await userFormRef.value.validate((valid) => {
    if (valid) {
      submitForm();
    }
  });
};

// 执行表单提交
const submitForm = async () => {
  try {
    const formData = { ...userForm.value };
    // 移除不必要的字段
    delete formData.confirmPassword;

    if (dialogType.value.add) {
      await addUserApi(formData);
      ElMessage.success('新增用户成功');
    } else {
      await editUserApi(formData);
      ElMessage.success('编辑用户成功');
    }
    dialogVisible.value = false;
    fetchTableList();
  } catch (err) {
    console.error(err);
    ElMessage.error(dialogType.value.add ? '新增用户失败' : '编辑用户失败');
  }
};

// 重置表单
const resetForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields();
  }
  userForm.value = {
    id: null,
    userName: '',
    nickName: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    sex: '0',
    deptId: null,
    status: 0,
    remark: '',
  };
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    userName: '',
    nickName: '',
    phone: '',
  };
  fetchTableList();
};


</script>

<style lang="scss" scoped></style>
