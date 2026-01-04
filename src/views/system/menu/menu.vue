<template>
  <page-container :title="meta.title" class="table-container">
    <template #header-left>
      <el-button type="primary" @click="handleAdd">新增菜单</el-button>
      <el-input
        v-model="searchForm.menuName"
        placeholder="请输入菜单名称"
        clearable
        style="width: 200px; margin-right: 10px"
      />
      <el-select
        v-model="searchForm.type"
        placeholder="请选择菜单类型"
        clearable
        style="width: 150px; margin-right: 10px"
      >
        <el-option label="目录" value="0" />
        <el-option label="菜单" value="1" />
        <el-option label="按钮" value="2" />
      </el-select>
      <el-button type="primary" @click="fetchTableList">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </template>

    <!-- 菜单树结构 -->
    <el-card class="menu-tree-card" shadow="never">
      <el-tree
        ref="menuTreeRef"
        :data="menuTree"
        :props="treeProps"
        :default-expanded-keys="expandedKeys"
        :default-checked-keys="checkedKeys"
        node-key="id"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        @node-contextmenu="handleNodeContextMenu"
      >
        <template #default="{ node, data }">
          <div class="tree-node-content">
            <span>{{ node.label }}</span>
            <div class="node-actions">
              <el-button
                type="text"
                size="small"
                @click.stop="handleEdit(data)"
              >
                编辑
              </el-button>
              <el-button type="text" size="small" @click.stop="handleAdd(data)">
                添加子菜单
              </el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="handleDelete(data)"
              >
                删除
              </el-button>
            </div>
          </div>
        </template>
      </el-tree>
    </el-card>

    <!-- 新增/编辑菜单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      destroy-on-close
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="父菜单" prop="parentId">
          <el-select
            v-model="menuForm.parentId"
            placeholder="请选择父菜单"
            style="width: 100%"
          >
            <el-option label="无父菜单" value="0" />
            <el-option
              v-for="menu in menuTree"
              :key="menu.id"
              :label="menu.menuName"
              :value="menu.id"
              v-if="menu.type === 0"
            >
              <span style="padding-left: 20px">{{ menu.menuName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="menuForm.orderNum" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-if="menuForm.type === 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-if="menuForm.type === 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="menuForm.perms" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menuForm.type">
            <el-radio label="0">目录</el-radio>
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="显示状态" prop="visible">
          <el-switch
            v-model="menuForm.visible"
            :active-value="0"
            :inactive-value="1"
            active-text="显示"
            inactive-text="隐藏"
          />
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-switch
            v-model="menuForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="停用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="menuForm.remark"
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
  </page-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import {
  getMenuListApi,
  getMenuTreeApi,
  getMenuDetailApi,
  createMenuApi,
  updateMenuApi,
  deleteMenuApi,
} from '@/api/system.menu.api';
import Columns from './menu.columns';

const { name, meta } = useRoute();

// 响应式数据
const data = ref([]);
const columns = Columns;
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 菜单树相关
const menuTree = ref([]);
const menuTreeRef = ref();
const expandedKeys = ref([]);
const checkedKeys = ref([]);
const currentNode = ref(null);

// 搜索表单
const searchForm = ref({
  menuName: '',
  type: '',
});

// 对话框相关
const dialogVisible = ref(false);
const menuFormRef = ref();
const dialogType = ref({ add: true, edit: false });
const dialogTitle = computed(() =>
  dialogType.value.add ? '新增菜单' : '编辑菜单',
);

// 菜单表单
const menuForm = ref({
  id: null,
  menuName: '',
  parentId: '0',
  orderNum: 0,
  path: '',
  component: '',
  perms: '',
  type: '0',
  icon: '',
  visible: 0,
  status: 0,
  remark: '',
});

// 表单验证规则
const menuRules = {
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    {
      min: 1,
      max: 50,
      message: '菜单名称长度在 1 到 50 个字符',
      trigger: 'blur',
    },
  ],
  orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [
    { required: true, message: '请输入路由地址', trigger: 'blur' },
    {
      min: 1,
      max: 200,
      message: '路由地址长度在 1 到 200 个字符',
      trigger: 'blur',
    },
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' },
    {
      min: 1,
      max: 200,
      message: '组件路径长度在 1 到 200 个字符',
      trigger: 'blur',
    },
  ],
};

// 树结构配置
const treeProps = {
  children: 'children',
  label: 'menuName',
  disabled: (data) => data.id === 1,
};

// 生命周期钩子
onMounted(() => {
  fetchMenuTree();
  fetchTableList();
});

// 监听搜索条件变化
watch(
  () => [searchForm.value.menuName, searchForm.value.type],
  () => {
    if (menuTreeRef.value) {
      menuTreeRef.value.filter(searchForm.value.menuName);
    }
  },
  { immediate: true, deep: true },
);

// 获取菜单列表
const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getMenuListApi();
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取菜单列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取菜单树
const fetchMenuTree = async () => {
  try {
    const res = await getMenuTreeApi();
    menuTree.value = res;
    // 默认展开所有节点
    expandedKeys.value = res.map((item) => item.id);
  } catch (err) {
    console.error(err);
    ElMessage.error('获取菜单树失败');
  }
};

// 过滤节点
const filterNode = (value, data) => {
  if (!value) return true;
  return data.menuName.includes(value);
};

// 节点点击
const handleNodeClick = (data, node, component) => {
  currentNode.value = data;
  // 可以在这里处理节点点击事件
};

// 节点右键菜单
const handleNodeContextMenu = (event, data, node, component) => {
  event.preventDefault();
  currentNode.value = data;
  // 可以在这里处理右键菜单事件
};

// 新增菜单
const handleAdd = (parentMenu = null) => {
  dialogType.value = { add: true, edit: false };
  resetForm();
  if (parentMenu) {
    menuForm.value.parentId = parentMenu.id;
  }
  dialogVisible.value = true;
};

// 编辑菜单
const handleEdit = (row) => {
  dialogType.value = { add: false, edit: true };
  menuForm.value = { ...row };
  dialogVisible.value = true;
};

// 删除菜单
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteMenuApi(row.id);
        ElMessage.success('删除成功');
        fetchMenuTree();
        fetchTableList();
      } catch (err) {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 提交表单
const handleSubmit = async () => {
  if (!menuFormRef.value) return;
  await menuFormRef.value.validate((valid) => {
    if (valid) {
      submitForm();
    }
  });
};

// 执行表单提交
const submitForm = async () => {
  try {
    const formData = { ...menuForm.value };

    if (dialogType.value.add) {
      await createMenuApi(formData);
      ElMessage.success('新增菜单成功');
    } else {
      await updateMenuApi(formData.id, formData);
      ElMessage.success('编辑菜单成功');
    }
    dialogVisible.value = false;
    fetchMenuTree();
    fetchTableList();
  } catch (err) {
    console.error(err);
    ElMessage.error(dialogType.value.add ? '新增菜单失败' : '编辑菜单失败');
  }
};

// 重置表单
const resetForm = () => {
  if (menuFormRef.value) {
    menuFormRef.value.resetFields();
  }
  menuForm.value = {
    id: null,
    menuName: '',
    parentId: '0',
    orderNum: 0,
    path: '',
    component: '',
    perms: '',
    type: '0',
    icon: '',
    visible: 0,
    status: 0,
    remark: '',
  };
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    menuName: '',
    type: '',
  };
  fetchTableList();
};
</script>

<style lang="scss" scoped>
.menu-tree-card {
  margin-bottom: 20px;
}

.tree-node-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 4px;

  .node-actions {
    display: none;
    gap: 8px;
  }

  &:hover .node-actions {
    display: flex;
  }
}
</style>
