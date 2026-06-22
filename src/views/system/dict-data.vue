<template>
  <div class="dict-data-container">
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
        <el-input v-model="queryParams.dictLabel" placeholder="字典标签" clearable style="width: 200px" />
        <el-input v-model="queryParams.dictValue" placeholder="字典键值" clearable style="width: 200px" />
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="字典状态"
          clearable
          style="width: 120px"
        />
        <el-button v-permission="['system:dict:add']" type="primary" :icon="Plus" @click="onAdd">新增</el-button>
        <el-button
          v-permission="['system:dict:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <StatusSwitch v-model="row.status" :id="row.id" :api="updateDictDataAPI" />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button
          v-permission="['system:dict:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="onEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-permission="['system:dict:delete']"
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

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      content-height="350px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import {
  getDictDataListAPI,
  createDictDataAPI,
  updateDictDataAPI,
  deleteDictDataAPI,
  batchDeleteDictDataAPI,
} from '@/api/system/dict-data'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'

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

const formRef = ref(null)

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
  handleSelectionChange,
  handleBatchDelete,
} = useCrud(
  getDictDataListAPI,
  {
    create: createDictDataAPI,
    update: updateDictDataAPI,
    delete: deleteDictDataAPI,
    batchDelete: batchDeleteDictDataAPI,
  },
  {
    nameField: 'dictLabel',
    defaultParams: { dictType: props.dictType, dictLabel: '', dictValue: '', status: '' },
    formDefaults: {
      dictType: props.dictType,
      dictLabel: '',
      dictValue: '',
      dictSort: 0,
      status: 1,
      cssClass: '',
      remark: '',
    },
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑字典数据' : '新增字典数据'))

const rules = {
  dictLabel: [{ required: true, message: '字典标签不能为空', trigger: 'blur' }],
  dictValue: [{ required: true, message: '字典键值不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'dictLabel', label: '字典标签', minWidth: 150 },
  { prop: 'dictValue', label: '字典键值', minWidth: 150 },
  { prop: 'dictSort', label: '字典排序', width: 100, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'remark', label: '备注', minWidth: 150 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 新增/编辑

const onAdd = () => {
  handleAdd()
  form.value.dictType = props.dictType
}

const onEdit = (row) => {
  handleEdit(row)
}

const onSubmit = () => {
  handleSubmit(formRef.value)
}

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
