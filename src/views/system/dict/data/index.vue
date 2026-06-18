<template>
  <div class="dict-data-container">
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
        <el-input v-model="queryParams.dictLabel" placeholder="字典标签" clearable style="width: 200px" />
        <el-input v-model="queryParams.dictValue" placeholder="字典键值" clearable style="width: 200px" />
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="字典状态"
          clearable
          style="width: 120px"
        />
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 是否默认 -->
      <template #isDefault="{ row }">
        <DictTag :value="row.isDefault" dict-type="sys_yes_no" />
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <DictTag :value="row.status" dict-type="sys_normal_disable" />
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
        <el-form-item label="字典类型:">
          <el-input :value="dictType" disabled />
        </el-form-item>
        <el-form-item label="字典标签:" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入字典标签" />
        </el-form-item>
        <el-form-item label="字典键值:" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入字典键值" />
        </el-form-item>
        <el-form-item label="字典排序:" prop="dictSort">
          <el-input-number v-model="form.dictSort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="是否默认:" prop="isDefault">
          <el-radio-group v-model="form.isDefault">
            <el-radio :value="0">否</el-radio>
            <el-radio :value="1">是</el-radio>
          </el-radio-group>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { formatDateTime } from '@/utils/date'
import { getDictDataListAPI, createDictDataAPI, updateDictDataAPI, deleteDictDataAPI, batchDeleteDictDataAPI } from '@/api/dict'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import DictTag from '@/components/DictTag/index.vue'

defineOptions({
  name: 'SystemDictDataIndex',
})

const props = defineProps({
  dictType: {
    type: String,
    default: '',
  },
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
  dictLabel: '',
  dictValue: '',
  status: '',
  dictType: '',
})

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.id ? '编辑字典数据' : '新增字典数据'))
const submitLoading = ref(false)
const formRef = ref(null)
const form = reactive({
  id: '',
  dictType: '',
  dictLabel: '',
  dictValue: '',
  dictSort: 0,
  isDefault: 0,
  status: 1,
  remark: '',
})

const rules = {
  dictLabel: [{ required: true, message: '字典标签不能为空', trigger: 'blur' }],
  dictValue: [{ required: true, message: '字典键值不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'dictLabel', label: '字典标签', minWidth: 150 },
  { prop: 'dictValue', label: '字典键值', minWidth: 150 },
  { prop: 'dictSort', label: '字典排序', width: 100, align: 'center' },
  { prop: 'isDefault', label: '是否默认', width: 100, align: 'center', slot: 'isDefault' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'remark', label: '备注', minWidth: 150 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 数据获取

const getData = async () => {
  if (!props.dictType) return

  loading.value = true
  queryParams.dictType = props.dictType
  try {
    const res = await getDictDataListAPI(queryParams)
    tableData.value = res?.list || res || []
    total.value = res?.total || 0
  } catch (error) {
    console.error('获取字典数据列表失败:', error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.dictType,
  (newVal) => {
    if (newVal) {
      queryParams.pageNum = 1
      queryParams.dictLabel = ''
      queryParams.dictValue = ''
      queryParams.status = ''
      getData()
    }
  },
  { immediate: true }
)

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
  form.dictType = props.dictType
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, {
    id: row.id,
    dictType: row.dictType,
    dictLabel: row.dictLabel,
    dictValue: row.dictValue,
    dictSort: row.dictSort || 0,
    isDefault: row.isDefault || 0,
    status: row.status,
    remark: row.remark,
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
        await updateDictDataAPI(form.id, form)
        ElMessage.success('修改成功')
      } else {
        await createDictDataAPI(form)
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
    dictType: props.dictType,
    dictLabel: '',
    dictValue: '',
    dictSort: 0,
    isDefault: 0,
    status: 1,
    remark: '',
  })
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除字典数据"${row.dictLabel}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteDictDataAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的字典数据')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 个字典数据吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteDictDataAPI(selectedIds.value)
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
  if (props.dictType) {
    getData()
  }
})

// #endregion
</script>

<style scoped>
.dict-data-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
