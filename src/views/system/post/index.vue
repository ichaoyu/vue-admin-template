<template>
  <div class="post-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="queryParams.pageNum"
      :limit="queryParams.pageSize"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @refresh="handleRefresh"
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.postCode" placeholder="岗位编码" clearable style="width: 200px" />
        <el-input v-model="queryParams.postName" placeholder="岗位名称" clearable style="width: 200px" />
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="岗位状态"
          clearable
          style="width: 120px"
        />
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
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
        <el-form-item label="岗位编码:" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入岗位编码" clearable />
        </el-form-item>
        <el-form-item label="岗位名称:" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" clearable />
        </el-form-item>
        <el-form-item label="显示排序:" prop="postSort">
          <el-input-number v-model="form.postSort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <DictSelect v-model="form.status" dict-type="sys_normal_disable" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" :rows="2" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getPostListAPI, createPostAPI, updatePostAPI, deletePostAPI, batchDeletePostsAPI } from '@/api/post'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'

defineOptions({
  name: 'SystemPostIndex',
})

// #region 数据定义

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const selectedIds = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  postCode: '',
  postName: '',
  status: '',
})

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑岗位' : '新增岗位'))
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: '',
  postCode: '',
  postName: '',
  postSort: 0,
  status: 1,
  remark: '',
})

const rules = {
  postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }],
  postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
  postSort: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'postCode', label: '岗位编码', minWidth: 120 },
  { prop: 'postName', label: '岗位名称', minWidth: 120 },
  { prop: 'postSort', label: '排序', width: 100, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'remark', label: '备注', minWidth: 150 },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getPostListAPI(queryParams)
    tableData.value = res?.list || res || []
    total.value = res?.total || tableData.value.length
  } catch (error) {
    console.error('获取岗位列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleRefresh = () => {
  getData()
}

const handlePageChange = (page) => {
  queryParams.pageNum = page
  getData()
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  queryParams.pageNum = 1
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
    postCode: row.postCode,
    postName: row.postName,
    postSort: row.postSort || 0,
    status: row.status || 0,
    remark: row.remark || '',
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
        await updatePostAPI(form.id, form)
        ElMessage.success('修改成功')
      } else {
        await createPostAPI(form)
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
    postCode: '',
    postName: '',
    postSort: 0,
    status: 1,
    remark: '',
  })
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除岗位"${row.postName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deletePostAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的岗位')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 个岗位吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeletePostsAPI(selectedIds.value)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  })
}

// #endregion

// #region 状态切换

const handleStatusChange = async (row) => {
  const postId = row.id || row.postId
  if (!postId) {
    row.status = row.status === 0 ? 1 : 0
    return
  }
  try {
    await updatePostAPI(postId, { status: row.status })
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = row.status === 0 ? 1 : 0
    console.error('状态更新失败:', error)
  }
}

// #endregion

// #region 生命周期

onMounted(() => {
  getData()
})

// #endregion
</script>

<style scoped>
.post-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
