<template>
  <page-container :title="meta.title" class="table-container">
    <template #header-left>
      <el-button type="primary" @click="handleAdd">新增角色</el-button>
      <el-input
        v-model="searchForm.roleName"
        placeholder="请输入角色名称"
        clearable
        style="width: 200px; margin-right: 10px"
      />
      <el-input
        v-model="searchForm.roleKey"
        placeholder="请输入角色标识"
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

    <!-- 新增/编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      destroy-on-close
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input v-model="roleForm.roleKey" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="roleSort">
          <el-input-number v-model="roleForm.roleSort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-switch
            v-model="roleForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="停用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="roleForm.remark"
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

    <!-- 权限分配对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="分配权限"
      width="60%"
      destroy-on-close
    >
      <el-form>
        <el-form-item label="权限设置">
          <el-tree
            ref="permissionTreeRef"
            :data="permissionList"
            :props="treeProps"
            :default-checked-keys="checkedKeys"
            show-checkbox
            node-key="id"
            :check-strictly="false"
            @check="handleCheck"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAssignPermission">确定</el-button>
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
  getRoleListApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  batchDeleteRoleApi,
  getRoleDetailApi,
} from '@/api/system.role.api';
import Table from '@/components/Table';
import Columns from './role.columns';

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
  roleName: '',
  roleKey: '',
});

// 对话框相关
const dialogVisible = ref(false);
const permissionDialogVisible = ref(false);
const roleFormRef = ref();
const permissionTreeRef = ref();
const dialogType = ref({ add: true, edit: false });
const dialogTitle = computed(() =>
  dialogType.value.add ? '新增角色' : '编辑角色',
);

// 角色表单
const roleForm = ref({
  id: null,
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: 0,
  remark: '',
});

// 权限相关
const permissionList = ref([]);
const checkedKeys = ref([]);
const treeProps = {
  children: 'children',
  label: 'name',
  disabled: (data) => data.id === 1,
};

// 表单验证规则
const roleRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 30, message: '角色名称长度在 2 到 30 个字符', trigger: 'blur' },
  ],
  roleKey: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { min: 2, max: 100, message: '角色标识长度在 2 到 100 个字符', trigger: 'blur' },
  ],
  roleSort: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
};

// 生命周期钩子
onMounted(() => {
  fetchTableList();
});

// 获取角色列表
const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getRoleListApi({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value,
    });
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取角色列表失败');
  } finally {
    loading.value = false;
  }
};

// 分页
const onPageChange = ({ page, size }) => {
  currentPage.value = page ?? currentPage.value;
  pageSize.value = size ?? pageSize.value;
  fetchTableList();
};

// 新增角色
const handleAdd = () => {
  dialogType.value = { add: true, edit: false };
  resetForm();
  dialogVisible.value = true;
};

// 编辑角色
const handleEdit = (row) => {
  dialogType.value = { add: false, edit: true };
  roleForm.value = { ...row };
  dialogVisible.value = true;
};

// 查看角色
const handleView = (row) => {
  handleEdit(row);
  // 查看模式可以禁用表单
};

// 删除角色
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteRoleApi(row.id);
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

// 批量删除角色
const handleBatchDelete = (selections) => {
  if (selections.length === 0) {
    ElMessage.warning('请选择要删除的角色');
    return;
  }
  ElMessageBox.confirm('确定要批量删除所选角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await batchDeleteRoleApi(selections.map((item) => item.id));
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

// 权限分配点击
const handleAssignPermissionClick = (row) => {
  fetchRolePermission(row.id);
};

// 获取角色权限
const fetchRolePermission = async (roleId) => {
  try {
    const res = await getRoleDetailApi(roleId);
    permissionList.value = res.permissions;
    checkedKeys.value = res.menuIds || [];
    permissionDialogVisible.value = true;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取角色权限失败');
  }
};

// 权限选择
const handleCheck = (data, checked, indeterminate) => {
  // 可以在这里处理权限选择逻辑
};

// 分配权限
const handleAssignPermission = async () => {
  try {
    const checkedNodes = permissionTreeRef.value.getCheckedNodes(false, true);
    const menuIds = checkedNodes.map((node) => node.id);
    // 这里需要调用分配权限的API，暂时使用模拟数据
    // await assignPermissionApi(roleForm.value.id, menuIds);
    ElMessage.success('权限分配成功');
    permissionDialogVisible.value = false;
  } catch (err) {
    console.error(err);
    ElMessage.error('权限分配失败');
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!roleFormRef.value) return;
  await roleFormRef.value.validate((valid) => {
    if (valid) {
      submitForm();
    }
  });
};

// 执行表单提交
const submitForm = async () => {
  try {
    const formData = { ...roleForm.value };

    if (dialogType.value.add) {
      await createRoleApi(formData);
      ElMessage.success('新增角色成功');
    } else {
      await updateRoleApi(formData.id, formData);
      ElMessage.success('编辑角色成功');
    }
    dialogVisible.value = false;
    fetchTableList();
  } catch (err) {
    console.error(err);
    ElMessage.error(dialogType.value.add ? '新增角色失败' : '编辑角色失败');
  }
};

// 重置表单
const resetForm = () => {
  if (roleFormRef.value) {
    roleFormRef.value.resetFields();
  }
  roleForm.value = {
    id: null,
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: 0,
    remark: '',
  };
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    roleName: '',
    roleKey: '',
  };
  fetchTableList();
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
    text: '权限分配',
    action: handleAssignPermissionClick,
    btnStyle: {
      type: 'info',
      link: true,
      text: false,
      icon: 'Authorization',
    },
  },
];
</script>

<style lang="scss" scoped></style>