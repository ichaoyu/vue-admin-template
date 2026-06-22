<template>
  <div class="article-container">
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
        <el-select v-model="queryParams.cid" placeholder="选择栏目" clearable style="width: 150px">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id ?? ''" />
        </el-select>
        <el-input v-model="queryParams.title" placeholder="文章标题" clearable style="width: 200px" />
        <el-select v-model="queryParams.status" placeholder="发布状态" clearable style="width: 120px">
          <el-option label="已发布" :value="1" />
          <el-option label="未发布" :value="0" />
        </el-select>
        <el-button v-permission="['cms:article:add']" type="primary" :icon="Plus" @click="onAdd">新增</el-button>
        <el-button
          v-permission="['cms:article:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button
          v-permission="['cms:article:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="onEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-permission="['cms:article:delete']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑抽屉 -->
    <el-drawer v-model="dialogVisible" :title="dialogTitle" direction="rtl" size="70%" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属栏目:" prop="cid">
              <el-select v-model="form.cid" placeholder="请选择栏目" style="width: 100%">
                <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id ?? ''" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章标题:" prop="title">
              <el-input v-model="form.title" placeholder="请输入文章标题" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签:" prop="tagId">
              <el-select v-model="form.tagId" multiple placeholder="请选择标签" style="width: 100%">
                <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面图:" prop="img">
              <el-input v-model="form.img" placeholder="请输入封面图地址" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述" :rows="2" />
        </el-form-item>
        <el-form-item label="文章内容:" prop="content">
          <RichTextEditor v-model="form.content" :height="400" placeholder="请输入文章内容..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="onSubmit">确定</el-button>
      </template>
    </el-drawer>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import {
  getArticleListAPI,
  createArticleAPI,
  updateArticleAPI,
  deleteArticleAPI,
  batchDeleteArticlesAPI,
} from '@/api/cms/article'
import { getAllCategoriesAPI } from '@/api/cms/category'
import { getAllTagsAPI } from '@/api/cms/tag'
import { formatDateTime } from '@/utils/date'
import RichTextEditor from '@/components/RichTextEditor/index.vue'
import ProTable from '@/components/Table/index.vue'

defineOptions({
  name: 'CmsArticleIndex',
})

// #region 数据定义

const formRef = ref(null)
const categoryList = ref([])
const tagList = ref([])

const formDefaults = {
  id: '',
  title: '',
  cid: '',
  content: '',
  tagId: '',
  img: '',
  status: 0,
  description: '',
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
  getArticleListAPI,
  { create: createArticleAPI, update: updateArticleAPI, delete: deleteArticleAPI, batchDelete: batchDeleteArticlesAPI },
  {
    nameField: 'title',
    formDefaults,
    defaultParams: { cid: '', title: '', status: '' },
    formatFormData: (row) => ({
      ...row,
      cid: row.cid || row.category?.id || '',
      tagId:
        row.tagId || (Array.isArray(row.tags) ? row.tags.map((t) => (typeof t === 'object' ? t.id : t)).join(',') : ''),
    }),
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑文章' : '新增文章'))

const rules = {
  cid: [{ required: true, message: '请选择栏目', trigger: 'change' }],
  title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '文章内容不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '序号', width: 60, align: 'center' },
  { prop: 'title', label: '文章标题', minWidth: 200 },
  { prop: 'cid', label: '栏目', width: 120, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 辅助数据加载

const loadCategoryList = async () => {
  try {
    const res = await getAllCategoriesAPI()
    categoryList.value = Array.isArray(res) ? res : res?.list || []
  } catch (error) {
    // 错误由 axios 拦截器统一处理
  }
}

const loadTagList = async () => {
  try {
    const res = await getAllTagsAPI()
    tagList.value = Array.isArray(res) ? res : res?.list || []
  } catch (error) {
    // 错误由 axios 拦截器统一处理
  }
}

// #endregion

// #region 新增/编辑

const onAdd = () => {
  handleAdd()
  loadCategoryList()
  loadTagList()
}

const onEdit = (row) => {
  handleEdit(row)
  loadCategoryList()
  loadTagList()
}

const onSubmit = () => {
  handleSubmit(formRef.value)
}

// #endregion
</script>

<style scoped>
.article-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

:deep(.el-drawer__body) {
  overflow-y: auto;
  padding: 20px;
}
</style>
