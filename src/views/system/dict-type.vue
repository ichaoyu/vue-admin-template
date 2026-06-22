<template>
  <div class="dict-type-container">
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
        <el-input v-model="queryParams.dictName" placeholder="字典名称" clearable style="width: 200px" />
        <el-input v-model="queryParams.dictType" placeholder="字典类型" clearable style="width: 200px" />
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

      <!-- 字典类型 -->
      <template #dictType="{ row }">
        <el-button type="primary" link @click="handleViewDictData(row)">{{ row.dictType }}</el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <StatusSwitch v-model="row.status" :id="row.id" :api="updateDictTypeAPI" />
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
      content-height="280px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="字典名称:" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型:" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" :disabled="!!form.id" />
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

    <!-- #region 字典数据抽屉 -->
    <el-drawer v-model="drawerVisible" title="字典数据" size="70%" :destroy-on-close="true">
      <DictDataPanel v-if="drawerVisible" :dict-type="currentDictType" />
    </el-drawer>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import {
  getDictTypeListAPI,
  createDictTypeAPI,
  updateDictTypeAPI,
  deleteDictTypeAPI,
  batchDeleteDictTypesAPI,
} from '@/api/system/dict-type'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'

defineOptions({
  name: 'SystemDictTypeIndex',
})

const DictDataPanel = defineAsyncComponent(() => import('./dict-data.vue'))

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
  getDictTypeListAPI,
  {
    create: createDictTypeAPI,
    update: updateDictTypeAPI,
    delete: deleteDictTypeAPI,
    batchDelete: batchDeleteDictTypesAPI,
  },
  {
    nameField: 'dictName',
    formDefaults: { dictName: '', dictType: '', status: 1, remark: '' },
    defaultParams: { dictName: '', dictType: '', status: '' },
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑字典类型' : '新增字典类型'))

const rules = {
  dictName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  dictType: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'dictName', label: '字典名称', minWidth: 150 },
  { prop: 'dictType', label: '字典类型', minWidth: 150, slot: 'dictType' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'remark', label: '备注', minWidth: 150 },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 抽屉相关

const drawerVisible = ref(false)
const currentDictType = ref('')

const handleViewDictData = (row) => {
  currentDictType.value = row.dictType
  drawerVisible.value = true
}

// #endregion

// #region 新增/编辑

const onAdd = () => {
  handleAdd()
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
.dict-type-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
