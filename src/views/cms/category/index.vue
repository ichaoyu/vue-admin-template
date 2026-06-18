<template>
  <div class="category-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :show-pagination="false"
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
      width="500px"
      content-height="300px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="栏目名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入栏目名称" clearable />
        </el-form-item>
        <el-form-item label="栏目别名:" prop="slug">
          <el-input v-model="form.slug" placeholder="请输入栏目别名" clearable />
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入描述" :rows="2" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getCategoryListAPI, createCategoryAPI, updateCategoryAPI, deleteCategoryAPI, batchDeleteCategoriesAPI } from '@/api/cms/category'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'

defineOptions({
  name: 'CmsCategoryIndex',
})

// #region 数据定义

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const selectedIds = ref([])

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑栏目' : '新增栏目'))
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: '',
  name: '',
  slug: '',
  sort: 0,
  description: '',
})

const rules = {
  name: [{ required: true, message: '栏目名称不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'name', label: '栏目名称', minWidth: 150 },
  { prop: 'slug', label: '栏目别名', minWidth: 150 },
  { prop: 'sort', label: '排序', width: 100, align: 'center' },
  { prop: 'description', label: '描述', minWidth: 200 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getCategoryListAPI()
    tableData.value = Array.isArray(res) ? res : res?.list || []
  } catch (error) {
    console.error('获取栏目列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  getData()
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
    slug: row.slug || '',
    sort: row.sort || 0,
    description: row.description || '',
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
        await updateCategoryAPI(form)
        ElMessage.success('修改成功')
      } else {
        await createCategoryAPI(form)
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
    slug: '',
    sort: 0,
    description: '',
  })
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除栏目"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteCategoryAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的栏目')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 个栏目吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteCategoriesAPI(selectedIds.value)
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
.category-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
