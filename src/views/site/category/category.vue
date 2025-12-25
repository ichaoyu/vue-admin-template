<template>
  <page-container :title="meta.title" class="table-container">
    <template #header-left>
      <el-button type="primary" @click="handleAdd">新增分类</el-button>
      <el-input
        v-model="searchForm.name"
        placeholder="请输入分类名称"
        clearable
        style="width: 200px; margin-right: 10px"
      />
      <el-select
        v-model="searchForm.status"
        placeholder="请选择状态"
        clearable
        style="width: 150px; margin-right: 10px"
      >
        <el-option label="正常" value="0" />
        <el-option label="停用" value="1" />
      </el-select>
      <el-button type="primary" @click="fetchTableList">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </template>
    
    <!-- 分类树结构 -->
    <el-card class="category-tree-card" shadow="never">
      <el-tree
        ref="categoryTreeRef"
        :data="categoryTree"
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
                添加子分类
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

    <!-- 新增/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      destroy-on-close
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父分类" prop="parentId">
          <el-select
            v-model="categoryForm.parentId"
            placeholder="请选择父分类"
            style="width: 100%"
          >
            <el-option label="无父分类" value="0" />
            <el-option
              v-for="category in categoryTree"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            >
              <span style="padding-left: 20px">{{ category.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="categoryForm.orderNum" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="分类状态" prop="status">
          <el-switch
            v-model="categoryForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="停用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="categoryForm.remark"
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
  getCategoryListApi,
  addCategoryApi,
  updateCategoryApi,
  delCategoryApi,
  getCategoryDetailApi,
} from '@/api/cms.category.api';
import Columns from './category.columns';

const { name, meta } = useRoute();

// 响应式数据
const data = ref([]);
const columns = Columns;
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(20);

// 分类树相关
const categoryTree = ref([]);
const categoryTreeRef = ref();
const expandedKeys = ref([]);
const checkedKeys = ref([]);
const currentNode = ref(null);

// 搜索表单
const searchForm = ref({
  name: '',
  status: '',
});

// 对话框相关
const dialogVisible = ref(false);
const categoryFormRef = ref();
const dialogType = ref({ add: true, edit: false });
const dialogTitle = computed(() =>
  dialogType.value.add ? '新增分类' : '编辑分类',
);

// 分类表单
const categoryForm = ref({
  id: null,
  name: '',
  parentId: '0',
  orderNum: 0,
  status: 0,
  remark: '',
});

// 表单验证规则
const categoryRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  orderNum: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
};

// 树结构配置
const treeProps = {
  children: 'children',
  label: 'name',
  disabled: (data) => data.id === 1,
};

// 生命周期钩子
onMounted(() => {
  fetchTableList();
  fetchCategoryTree();
});

// 监听搜索条件变化
watch(
  () => [searchForm.value.name, searchForm.value.status],
  () => {
    if (categoryTreeRef.value) {
      categoryTreeRef.value.filter(searchForm.value.name);
    }
  },
  { immediate: true, deep: true }
);

// 获取分类列表
const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getCategoryListApi({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value,
    });
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取分类列表失败');
  } finally {
    loading.value = false;
  }
};

// 获取分类树
const fetchCategoryTree = async () => {
  try {
    const res = await getCategoryListApi({});
    // 将列表数据转换为树结构
    const treeData = buildTree(res.list, '0');
    categoryTree.value = treeData;
    // 默认展开所有节点
    expandedKeys.value = treeData.map((item) => item.id);
  } catch (err) {
    console.error(err);
    ElMessage.error('获取分类树失败');
  }
};

// 构建树形结构
const buildTree = (data, parentId) => {
  const result = [];
  for (const item of data) {
    if (item.parentId === parentId) {
      const children = buildTree(data, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      result.push(item);
    }
  }
  return result;
};

// 过滤节点
const filterNode = (value, data) => {
  if (!value) return true;
  return data.name.includes(value);
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

// 新增分类
const handleAdd = (parentCategory = null) => {
  dialogType.value = { add: true, edit: false };
  resetForm();
  if (parentCategory) {
    categoryForm.value.parentId = parentCategory.id;
  }
  dialogVisible.value = true;
};

// 编辑分类
const handleEdit = (row) => {
  dialogType.value = { add: false, edit: true };
  categoryForm.value = { ...row };
  dialogVisible.value = true;
};

// 删除分类
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await delCategoryApi(row.id);
        ElMessage.success('删除成功');
        fetchCategoryTree();
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
  if (!categoryFormRef.value) return;
  await categoryFormRef.value.validate((valid) => {
    if (valid) {
      submitForm();
    }
  });
};

// 执行表单提交
const submitForm = async () => {
  try {
    const formData = { ...categoryForm.value };

    if (dialogType.value.add) {
      await addCategoryApi(formData);
      ElMessage.success('新增分类成功');
    } else {
      await updateCategoryApi(formData);
      ElMessage.success('编辑分类成功');
    }
    dialogVisible.value = false;
    fetchCategoryTree();
    fetchTableList();
  } catch (err) {
    console.error(err);
    ElMessage.error(dialogType.value.add ? '新增分类失败' : '编辑分类失败');
  }
};

// 重置表单
const resetForm = () => {
  if (categoryFormRef.value) {
    categoryFormRef.value.resetFields();
  }
  categoryForm.value = {
    id: null,
    name: '',
    parentId: '0',
    orderNum: 0,
    status: 0,
    remark: '',
  };
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    name: '',
    status: '',
  };
  fetchTableList();
};
</script>

<style lang="scss" scoped>
.category-tree-card {
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