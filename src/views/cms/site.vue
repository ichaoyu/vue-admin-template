<template>
  <div class="site-container">
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
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" size="small" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" size="small" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      content-height="400px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="站点名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入站点名称" clearable />
        </el-form-item>
        <el-form-item label="站点标题:" prop="title">
          <el-input v-model="form.title" placeholder="请输入站点标题" clearable />
        </el-form-item>
        <el-form-item label="站点关键词:" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入站点关键词" clearable />
        </el-form-item>
        <el-form-item label="站点描述:" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入站点描述" :rows="2" />
        </el-form-item>
        <el-form-item label="备案号:" prop="icp">
          <el-input v-model="form.icp" placeholder="请输入备案号" clearable />
        </el-form-item>
        <el-form-item label="联系邮箱:" prop="email">
          <el-input v-model="form.email" placeholder="请输入联系邮箱" clearable />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getSiteListAPI, createSiteAPI, updateSiteAPI, deleteSiteAPI, batchDeleteSitesAPI } from '@/api/cms/site'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'

defineOptions({
  name: 'CmsSiteIndex',
})

// #region 数据定义

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedIds = ref([])

const queryParams = reactive({
  page: 1,
  pageSize: 20,
})

const page = computed({
  get: () => queryParams.page,
  set: (val) => {
    queryParams.page = val
  },
})

const limit = computed({
  get: () => queryParams.pageSize,
  set: (val) => {
    queryParams.pageSize = val
    queryParams.page = 1
  },
})

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑站点信息' : '新增站点信息'))
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: '',
  name: '',
  title: '',
  keywords: '',
  description: '',
  icp: '',
  email: '',
})

const rules = {
  name: [{ required: true, message: '站点名称不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '站点标题不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'name', label: '站点名称', minWidth: 150 },
  { prop: 'title', label: '站点标题', minWidth: 200 },
  { prop: 'keywords', label: '关键词', minWidth: 200 },
  { prop: 'icp', label: '备案号', minWidth: 150 },
  { prop: 'email', label: '联系邮箱', minWidth: 180 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getSiteListAPI({
      page: queryParams.page,
      pageSize: queryParams.pageSize,
    })
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    // 错误由 axios 拦截器处理
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  getData()
}

const handlePageChange = (val) => {
  queryParams.page = val
  getData()
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val
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
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, {
    id: row.id,
    name: row.name,
    title: row.title || '',
    keywords: row.keywords || '',
    description: row.description || '',
    icp: row.icp || '',
    email: row.email || '',
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (form.id) {
        await updateSiteAPI(form)
        ElMessage.success('修改成功')
      } else {
        await createSiteAPI(form)
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
    name: '',
    title: '',
    keywords: '',
    description: '',
    icp: '',
    email: '',
  })
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除站点"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteSiteAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的站点信息')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条站点信息吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteSitesAPI(selectedIds.value)
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
  getData()
})

// #endregion
</script>

<style scoped>
.site-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
