<template>
  <div class="pro-table">
    <!-- #region 工具栏 -->
    <div v-if="showToolbar" class="pro-table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button circle :icon="Refresh" @click="handleRefresh" />
          </el-tooltip>
          <el-popover trigger="hover" placement="bottom-end" :width="200">
            <template #reference>
              <el-button circle :icon="Grid" />
            </template>
            <div class="column-setting">
              <div class="setting-title">列设置</div>
              <el-checkbox v-for="col in columns" :key="col.prop" v-model="col.visible">
                {{ col.label }}
              </el-checkbox>
            </div>
          </el-popover>
          <el-dropdown trigger="click" @command="handleSizeChange">
            <el-button circle :icon="Setting" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="size in tableSizes"
                  :key="size.value"
                  :command="size.value"
                  :class="{ 'is-active': tableSize === size.value }"
                >
                  {{ size.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </slot>
      </div>
    </div>
    <!-- #endregion -->

    <!-- #region 表格主体 -->
    <div v-loading="loading" class="pro-table-body">
      <el-table
        ref="tableRef"
        :data="tableData"
        :size="tableSize"
        :border="border"
        :stripe="stripe"
        :row-key="rowKey"
        :tree-props="treeProps"
        :default-expand-all="defaultExpandAll"
        height="100%"
        v-bind="$attrs"
        @sort-change="handleSortChange"
      >
        <template v-for="(col, index) in visibleColumns" :key="col.prop || index">
          <el-table-column v-if="col.type" v-bind="col" />
          <el-table-column v-else v-bind="col">
            <template v-if="col.slot" #default="scope">
              <slot :name="col.slot" v-bind="scope" />
            </template>
            <template v-else-if="col.formatter" #default="scope">
              {{ col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) }}
            </template>
            <template v-else #default="scope">
              {{ scope.row[col.prop] }}
            </template>
          </el-table-column>
        </template>
        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </el-table>
    </div>
    <!-- #endregion -->

    <!-- #region 分页 -->
    <div v-if="showPagination" class="pro-table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :layout="paginationLayout"
        background
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      />
    </div>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Refresh, Setting, Grid } from '@element-plus/icons-vue'

defineOptions({
  name: 'ProTable',
  inheritAttrs: false,
})

// #region Props 定义

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  border: {
    type: Boolean,
    default: true,
  },
  stripe: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: [String, Function],
    default: 'id',
  },
  treeProps: {
    type: Object,
    default: () => ({ children: 'children' }),
  },
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  showToolbar: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 10,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

// #endregion

// #region Emits 定义

const emit = defineEmits(['update:page', 'update:limit', 'page-change', 'size-change', 'refresh', 'sort-change'])

// #endregion

// #region 数据定义

const tableRef = ref(null)
const tableData = computed(() => props.data)
const tableSize = ref('default')

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val),
})
const pageSize = computed({
  get: () => props.limit,
  set: (val) => emit('update:limit', val),
})

const tableSizes = [
  { label: '大', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '小', value: 'small' },
]

const columns = ref(
  props.columns.map((col) => ({
    ...col,
    visible: col.visible !== false,
  }))
)

const visibleColumns = computed(() => columns.value.filter((col) => col.visible))

// #endregion

// #region 事件处理

const handleRefresh = () => {
  emit('refresh')
}

const handleSizeChange = (size) => {
  tableSize.value = size
}

const handlePageChange = (page) => {
  emit('page-change', page)
}

const handlePageSizeChange = (size) => {
  emit('size-change', size)
}

const handleSortChange = (column, prop, order) => {
  emit('sort-change', column, prop, order)
}

// #endregion

// #region 监听器

watch(
  () => props.columns,
  (newColumns) => {
    columns.value = newColumns.map((col) => ({
      ...col,
      visible: col.visible !== false,
    }))
  },
  { deep: true }
)

// #endregion

// #region 暴露方法

defineExpose({
  tableRef,
  getTableRef: () => tableRef.value,
  getSelectionRows: () => tableRef.value?.getSelectionRows?.(),
  clearSelection: () => tableRef.value?.clearSelection?.(),
  toggleRowSelection: (row, selected) => tableRef.value?.toggleRowSelection?.(row, selected),
  toggleAllSelection: () => tableRef.value?.toggleAllSelection?.(),
  setCurrentRow: (row) => tableRef.value?.setCurrentRow?.(row),
  clearSort: () => tableRef.value?.clearSort?.(),
  toggleRowExpansion: (row, expanded) => tableRef.value?.toggleRowExpansion?.(row, expanded),
})

// #endregion
</script>

<style scoped>
.pro-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.pro-table-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.toolbar-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.toolbar-right {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
}

.column-setting {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.setting-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.pro-table-body {
  flex: 1;
  min-height: 0;
}

.pro-table-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
}
</style>
