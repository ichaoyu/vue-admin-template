<template>
  <page-container :title="meta.title" class="table-container">
    <template #header-left>
      <el-button type="primary" @click="handleAdd">新增岗位</el-button>
      <el-input
        v-model="searchForm.postName"
        placeholder="请输入岗位名称"
        clearable
        style="width: 200px; margin-right: 10px"
      />
      <el-input
        v-model="searchForm.postCode"
        placeholder="请输入岗位编码"
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
    <Table
      :columns="columns"
      :data="data"
      selection
      :action="operator"
      :actionConfig="{
        width: 200,
      }"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pagination="{ defaultPageSize: 50, total }"
      @page-change="onPageChange"
      @batch-delete="handleBatchDelete"
      class="common-table"
      v-loading="loading"
    />

    <!-- 新增/编辑岗位对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      destroy-on-close
    >
      <el-form
        ref="postFormRef"
        :model="postForm"
        :rules="postRules"
        label-width="100px"
      >
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="postForm.postName" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="postForm.postCode" placeholder="请输入岗位编码" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="postSort">
          <el-input-number v-model="postForm.postSort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-switch
            v-model="postForm.status"
            :active-value="0"
            :inactive-value="1"
            active-text="正常"
            inactive-text="停用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="postForm.remark"
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
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
import {
  getPostListApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
  batchDeletePostApi,
  getPostDetailApi,
} from '@/api/system.post.api';
import Table from '@/components/Table';
import Columns from './post.columns';

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
  postName: '',
  postCode: '',
  status: '',
});

// 对话框相关
const dialogVisible = ref(false);
const postFormRef = ref();
const dialogType = ref({ add: true, edit: false });
const dialogTitle = computed(() =>
  dialogType.value.add ? '新增岗位' : '编辑岗位',
);

// 岗位表单
const postForm = ref({
  id: null,
  postName: '',
  postCode: '',
  postSort: 0,
  status: 0,
  remark: '',
});

// 表单验证规则
const postRules = {
  postName: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
    {
      min: 1,
      max: 50,
      message: '岗位名称长度在 1 到 50 个字符',
      trigger: 'blur',
    },
  ],
  postCode: [
    { required: true, message: '请输入岗位编码', trigger: 'blur' },
    {
      min: 1,
      max: 50,
      message: '岗位编码长度在 1 到 50 个字符',
      trigger: 'blur',
    },
  ],
  postSort: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
};

// 获取岗位列表
const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getPostListApi({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value,
    });
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取岗位列表失败');
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

// 新增岗位
const handleAdd = () => {
  dialogType.value = { add: true, edit: false };
  resetForm();
  dialogVisible.value = true;
};

// 编辑岗位
const handleEdit = (row) => {
  dialogType.value = { add: false, edit: true };
  postForm.value = { ...row };
  dialogVisible.value = true;
};

// 查看岗位
const handleView = (row) => {
  handleEdit(row);
  // 查看模式可以禁用表单
};

// 删除岗位
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该岗位吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deletePostApi(row.id);
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
];

// 生命周期钩子
onMounted(() => {
  fetchTableList();
});

// 批量删除岗位
const handleBatchDelete = (selections) => {
  if (selections.length === 0) {
    ElMessage.warning('请选择要删除的岗位');
    return;
  }
  ElMessageBox.confirm('确定要批量删除所选岗位吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await batchDeletePostApi(selections.map((item) => item.id));
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

// 提交表单
const handleSubmit = async () => {
  if (!postFormRef.value) return;
  await postFormRef.value.validate((valid) => {
    if (valid) {
      submitForm();
    }
  });
};

// 执行表单提交
const submitForm = async () => {
  try {
    const formData = { ...postForm.value };

    if (dialogType.value.add) {
      await createPostApi(formData);
      ElMessage.success('新增岗位成功');
    } else {
      await updatePostApi(formData.id, formData);
      ElMessage.success('编辑岗位成功');
    }
    dialogVisible.value = false;
    fetchTableList();
  } catch (err) {
    console.error(err);
    ElMessage.error(dialogType.value.add ? '新增岗位失败' : '编辑岗位失败');
  }
};

// 重置表单
const resetForm = () => {
  if (postFormRef.value) {
    postFormRef.value.resetFields();
  }
  postForm.value = {
    id: null,
    postName: '',
    postCode: '',
    postSort: 0,
    status: 0,
    remark: '',
  };
};

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    postName: '',
    postCode: '',
    status: '',
  };
  fetchTableList();
};
</script>

<style lang="scss" scoped></style>
