<template>
  <div class="message-container">
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

      <!-- 状态 -->
      <template #status="{ row }">
        <el-tag v-if="row.status === 1 || row.status === true" type="success" size="small">已读</el-tag>
        <el-tag v-else type="info" size="small">未读</el-tag>
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
      content-height="350px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="联系方式:" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" clearable />
        </el-form-item>
        <el-form-item label="留言内容:" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入留言内容" :rows="3" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="0">已读</el-radio>
            <el-radio :value="1">未读</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getMessageListAPI, createMessageAPI, updateMessageAPI, deleteMessageAPI, batchDeleteMessagesAPI } from '@/api/cms/message'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'

defineOptions({
  name: 'CmsMessageIndex',
})

// #region 数据定义

const tableRef = ref(null)
const loading = ref(false)
const tableData = ref([])
const selectedIds = ref([])

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑留言' : '新增留言'))
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  id: '',
  name: '',
  contact: '',
  content: '',
  status: 1,
})

const rules = {
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '留言内容不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'name', label: '姓名', minWidth: 120 },
  { prop: 'contact', label: '联系方式', minWidth: 150 },
  { prop: 'content', label: '留言内容', minWidth: 200 },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
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
    const res = await getMessageListAPI()
    tableData.value = Array.isArray(res) ? res : res?.list || []
  } catch (error) {
    console.error('获取留言列表失败:', error)
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
    contact: row.contact || '',
    content: row.content || '',
    status: row.status ?? 1,
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
        await updateMessageAPI(form)
        ElMessage.success('修改成功')
      } else {
        await createMessageAPI(form)
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
    contact: '',
    content: '',
    status: 1,
  })
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除该留言吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteMessageAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的留言')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条留言吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteMessagesAPI(selectedIds.value)
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
.message-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
