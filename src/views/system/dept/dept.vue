<template>
  <page-container :title="meta.title" class="table-container">
    <template #header-left>
      <el-button type="primary" @click="handleAdd">新增部门</el-button>
      <el-input
        v-model="searchForm.deptName"
        placeholder="请输入部门名称"
        clearable
        style="width: 200px; margin-right: 10px"
      />
      <el-select
        v-model="searchForm.status"
        placeholder="请选择部门状态"
        clearable
        style="width: 150px; margin-right: 10px"
      >
        <el-option label="正常" value="0" />
        <el-option label="停用" value="1" />
      </el-select>
      <el-button type="primary" @click="fetchTableList">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </template>
    
    <!-- 部门树结构 -->
    <el-card class="dept-tree-card" shadow="never">
      <el-tree
        ref="deptTreeRef"
        :data="deptTree"
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
              <el-button
                type="text"
                size="small"
                @click.stop="handleAdd(data)"
              >
                添加子部门
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

    <!-- 新增/编辑部门对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      destroy-on-close
    >
      <el-form
        ref="deptFormRef"
        :model="deptForm"
        :rules="deptRules"
        label-width="100px"
      >
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="父部门" prop="parentId">
          <el-select
            v-model="deptForm.parentId"
            placeholder="请选择父部门"
            style="width: 100%"
          >
            <el-option label="无父部门" value="0" />
            <el-option
              v-for="dept in deptTree"
              :key="dept.id"
              :label="dept.deptName"
              :value="dept.id"
            >
              <span style="padding-left: 20px">{{ dept.deptName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="deptForm.orderNum" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="deptForm.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="deptForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="deptForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="部门状态" prop="status">
          <el-switch
            v-model="deptForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="停用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="deptForm.remark"
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
import dayjs from 'dayjs';
import {
  getDeptListApi,
  getDeptTreeApi,
  getDeptDetailApi,
  createDeptApi,
  updateDeptApi,
  deleteDeptApi,
} from '@/api/system.dept.api';
import Columns from './dept.columns';

const { name, meta } = useRoute();

// 响应式数据
const data = ref([]);
const columns = Columns;
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 部门树相关
const deptTree = ref([]);
const deptTreeRef = ref();
const expandedKeys = ref([]);
const checkedKeys = ref([]);
const currentNode = ref(null);

// 搜索表单
const searchForm = ref({
  deptName: '',
  status: '',
});

// 对话框相关
const dialogVisible = ref(false);
const deptFormRef = ref();
const dialogType = ref({ add: true, edit: false });
const dialogTitle = computed(() =>
  dialogType.value.add ? '新增部门' : '编辑部门',
);

// 部门表单
const deptForm = ref({
  id: null,
  deptName: '',
  parentId: '0',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: 0,
  remark: '',
});

// 表单验证规则
const deptRules = {
  deptName: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 1, max: 50, message: '部门名称长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
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
};

// 树结构配置
const treeProps = {
  children: 'children',
  label: 'deptName',
  disabled: (data) => data.id === 1,
};

// 生命周期钩子
onMounted(() => {
  fetchDeptTree();
  fetchTableList();
});

// 监听搜索条件变化
watch(
  () => [searchForm.value.deptName, searchForm.value.status],
  () => {
    if (deptTreeRef.value) {
      deptTreeRef.value.filter(searchForm.value.deptName);
    }
  },
  { immediate: true, deep: true }
);

// 获取部门列表
const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getDeptListApi();
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取部门列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取部门树
const fetchDeptTree = async () => {
  try {
    const res = await getDeptTreeApi();
    deptTree.value = res;
    // 默认展开所有节点
    expandedKeys.value = res.map((item) => item.id);
  } catch (err) {
    console.error(err);
    ElMessage.error('获取部门树失败');
  }
};

// 过滤节点
const filterNode = (value, data) => {
  if (!value) return true;
  return data.deptName.includes(value);
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

// 新增部门
const handleAdd = (parentDept = null) => {
  dialogType.value = { add: true, edit: false };
  resetForm();
  if (parentDept) {
    deptForm.value.parentId = parentDept.id;
  }
  dialogVisible.value = true;
};

// 编辑部门
const handleEdit = (row) => {
  dialogType.value = { add: false, edit: true };
  deptForm.value = { ...row };
  dialogVisible.value = true;
};

// 删除部门
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteDeptApi(row.id);
        ElMessage.success('删除成功');
        fetchDeptTree();
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
  if (!deptFormRef.value) return;
  await deptFormRef.value.validate((valid) => {
    if (valid) {
      submitForm();
    }
  });
};

// 执行表单提交
const submitForm = async () => {
  try {
    const formData = { ...deptForm.value };

    if (dialogType.value.add) {
      await createDeptApi(formData);
      ElMessage.success('新增部门成功');
    } else {
      await updateDeptApi(formData.id, formData);
      ElMessage.success('编辑部门成功');
    }
    dialogVisible.value = false;
    fetchDeptTree();
    fetchTableList();
  } catch (err) {
    console.error(err);
    ElMessage.error(dialogType.value.add ? '新增部门失败' : '编辑部门失败');
  }
};

// 重置表单
const resetForm = () => {
  if (deptFormRef.value) {
    deptFormRef.value.resetFields();
  }
  deptForm.value = {
    id: null,
    deptName: '',
    parentId: '0',
    orderNum: 0,
    leader: '',
    phone: '',
    email: '',
    status: 0,
    remark: '',
  };
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    deptName: '',
    status: '',
  };
  fetchTableList();
};
</script>

<style lang="scss" scoped>
.dept-tree-card {
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