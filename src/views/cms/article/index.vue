<template>
  <div class="article-container">
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
        <el-select v-model="queryParams.cid" placeholder="选择栏目" clearable style="width: 150px">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id ?? ''" />
        </el-select>
        <el-input v-model="queryParams.title" placeholder="文章标题" clearable style="width: 200px" />
        <el-select v-model="queryParams.status" placeholder="发布状态" clearable style="width: 120px">
          <el-option label="已发布" :value="0" />
          <el-option label="未发布" :value="1" />
        </el-select>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag v-if="row.status === 0" type="success" size="small">已发布</el-tag>
        <el-tag v-else type="warning" size="small">未发布</el-tag>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" size="small" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" size="small" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑抽屉 -->
    <el-drawer v-model="drawerVisible" :title="drawerTitle" direction="rtl" size="70%" :close-on-click-modal="false">
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
            <el-form-item label="短标题:" prop="shortTitle">
              <el-input v-model="form.shortTitle" placeholder="请输入短标题" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者:" prop="author">
              <el-input v-model="form.author" placeholder="请输入作者" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="来源:" prop="source">
              <el-input v-model="form.source" placeholder="请输入来源" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布状态:" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :value="0">发布</el-radio>
                <el-radio :value="1">不发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="缩略图:" prop="img">
          <el-input v-model="form.img" placeholder="请输入缩略图URL" clearable />
        </el-form-item>
        <el-form-item label="文章简述:" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入文章简述" :rows="2" />
        </el-form-item>
        <el-form-item label="文章内容:" prop="content">
          <RichTextEditor v-model="form.content" :height="400" placeholder="请输入文章内容..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import {
  getArticleListAPI,
  createArticleAPI,
  updateArticleAPI,
  deleteArticleAPI,
  batchDeleteArticlesAPI,
} from '@/api/cms/article'
import { getCategoryListAPI } from '@/api/cms/category'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import RichTextEditor from '@/components/RichTextEditor/index.vue'

defineOptions({
  name: 'CmsArticleIndex',
})

// #region 数据定义

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const categoryList = ref([])
const selectedIds = ref([])

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  cid: '',
  title: '',
  status: '',
})

const drawerVisible = ref(false)
const drawerTitle = computed(() => (form.id ? '编辑文章' : '新增文章'))
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: '',
  cid: '',
  title: '',
  shortTitle: '',
  author: '',
  source: '',
  status: 1,
  img: '',
  description: '',
  content: '',
})

const rules = {
  cid: [{ required: true, message: '请选择栏目', trigger: 'change' }],
  title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '文章内容不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'title', label: '文章标题', minWidth: 200 },
  { prop: 'author', label: '作者', width: 100 },
  { prop: 'source', label: '来源', width: 100 },
  { prop: 'pv', label: '浏览量', width: 80, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getArticleListAPI(queryParams)
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取文章列表失败:', error)
  } finally {
    loading.value = false
  }
}

const getCategoryData = async () => {
  try {
    const res = await getCategoryListAPI()
    // 处理返回数据，可能是对象或数组
    const list = Array.isArray(res) ? res : res?.list || res?.data || []
    categoryList.value = list.filter((item) => item != null)
  } catch (error) {
    console.error('获取栏目列表失败:', error)
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
  drawerVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, {
    id: row.id,
    cid: row.cid,
    title: row.title,
    shortTitle: row.shortTitle || '',
    author: row.author || '',
    source: row.source || '',
    status: row.status ?? 0,
    img: row.img || '',
    description: row.description || '',
    content: row.content || '',
  })
  drawerVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (form.id) {
        await updateArticleAPI(form)
        ElMessage.success('修改成功')
      } else {
        await createArticleAPI(form)
        ElMessage.success('新增成功')
      }
      drawerVisible.value = false
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
    cid: '',
    title: '',
    shortTitle: '',
    author: '',
    source: '',
    status: 1,
    img: '',
    description: '',
    content: '',
  })
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除文章"${row.title}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteArticleAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的文章')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 篇文章吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteArticlesAPI(selectedIds.value)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  })
}

// #endregion

// #region 生命周期

onMounted(() => {
  getCategoryData()
  getData()
})

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
