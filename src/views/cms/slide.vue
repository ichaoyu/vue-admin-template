<template>
  <div class="slide-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      @refresh="handleRefresh"
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-button v-permission="['cms:slide:add']" type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button
          v-permission="['cms:slide:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 图片 -->
      <template #imgUrl="{ row }">
        <el-image
          v-if="row.imgUrl"
          :src="row.imgUrl"
          :preview-src-list="[row.imgUrl]"
          style="width: 100px; height: 60px"
          fit="cover"
        />
        <span v-else>-</span>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
      </template>

      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button
          v-permission="['cms:slide:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button
          v-permission="['cms:slide:delete']"
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
        <el-form-item label="标题:" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label="图片地址:" prop="imgUrl">
          <el-input v-model="form.imgUrl" placeholder="请输入图片地址" clearable />
        </el-form-item>
        <el-form-item label="链接地址:" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="请输入链接地址" clearable />
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input-number v-model="form.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="备注:" prop="mark">
          <el-input v-model="form.mark" type="textarea" placeholder="请输入备注" :rows="2" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { useCrud } from '@/hooks'
import { getSlideListAPI, createSlideAPI, updateSlideAPI, deleteSlideAPI, batchDeleteSlidesAPI } from '@/api/cms/slide'
import { formatDateTime } from '@/utils/date'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'

defineOptions({
  name: 'CmsSlideIndex',
})

// #region 数据定义

const formRef = ref(null)

const formDefaults = {
  id: '',
  title: '',
  imgUrl: '',
  linkUrl: '',
  sort: 0,
  status: 1,
  mark: '',
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
  getSlideListAPI,
  { create: createSlideAPI, update: updateSlideAPI, delete: deleteSlideAPI, batchDelete: batchDeleteSlidesAPI },
  {
    nameField: 'title',
    formDefaults,
    defaultParams: {},
  }
)

const dialogTitle = computed(() => (form.value.id ? '编辑轮播图' : '新增轮播图'))

const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  imgUrl: [{ required: true, message: '图片地址不能为空', trigger: 'blur' }],
}

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { type: 'index', label: '序号', width: 60, align: 'center' },
  { prop: 'imgUrl', label: '图片', width: 130, align: 'center', slot: 'imgUrl' },
  { prop: 'title', label: '标题', minWidth: 150 },
  { prop: 'linkUrl', label: '链接地址', minWidth: 200 },
  { prop: 'sort', label: '排序', width: 100, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 提交

const onSubmit = () => {
  handleSubmit(formRef.value)
}

// #endregion
</script>

<style scoped>
.slide-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
