<template>
  <div class="table-wrapper">
    <!-- 表格工具栏 -->
    <div class="table-tools" v-if="$slots.toolbar">
      <slot name="toolbar"></slot>
    </div>

    <!-- 多选操作栏 -->
    <div class="table-selection" v-if="selections.length > 0">
      <span class="selection-info">已选择 {{ selections.length }} 项</span>
      <slot name="selections"></slot>
      <el-button type="danger" @click="handleBatchDelete" size="small"
        >批量删除</el-button
      >
      <el-button @click="handleCancelSelection" size="small"
        >取消选择</el-button
      >
    </div>

    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="props.data"
      :loading="props.loading"
      :highlight-current-row="props.highlightCurrentRow"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      @cell-click="handleCellClick"
    >
      <!-- 展开列 -->
      <el-table-column v-if="props.expand" type="expand" fixed>
        <template #default="scope">
          <slot name="expand" :row="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>

      <!-- 序号列 -->
      <el-table-column
        v-if="props.index"
        type="index"
        width="60"
        fixed
        align="center"
      >
        <template #default="scope">
          {{ (props.currentPage - 1) * props.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 多选列 -->
      <el-table-column
        v-if="props.selection"
        type="selection"
        width="45"
        fixed
      />

      <!-- 动态列渲染 -->
      <template v-for="column in props.columns" :key="column.key">
        <el-table-column
          :label="column.label"
          :prop="column.key"
          :width="column.width"
          :min-width="column.minWidth"
          :type="column.type"
          :sortable="column.sortable"
          :align="column.align || props.align"
          :header-align="column.headerAlign || props.headerAlign"
          :fixed="column.fixed"
          :show-overflow-tooltip="
            column.showOverflowTooltip || props.showOverflowTooltip
          "
        >
          <!-- 自定义表头插槽 -->
          <template #header v-if="column.slotName?.includes('header')">
            <slot :name="column.slotName" :column="column"></slot>
          </template>

          <!-- 自定义内容插槽 -->
          <template #default="scope">
            <!-- 优先使用插槽渲染 -->
            <template
              v-if="column.slotName && !column.slotName.includes('header')"
            >
              <slot
                :name="column.slotName"
                :row="scope.row"
                :index="scope.$index"
                :column="column"
              ></slot>
            </template>
            <!-- 其次使用自定义渲染函数 -->
            <template v-else-if="column.render">
              <component
                :is="renderComponent"
                :render="column.render"
                :row="scope.row"
                :column="column"
                :index="scope.$index"
              />
            </template>
            <!-- 字典映射渲染 -->
            <template v-else-if="column.dictMap">
              <span>
                <i
                  v-if="column.dictMap.color"
                  class="dict-dot"
                  :style="{
                    backgroundColor:
                      column.dictMap.color[scope.row[column.key]],
                  }"
                ></i>
                {{
                  column.dictMap.value[scope.row[column.key]] ||
                  scope.row[column.key]
                }}
              </span>
            </template>
            <!-- 链接形式渲染 -->
            <template v-else-if="column.oprAction">
              <el-link
                type="primary"
                @click="column.oprAction(scope.row, scope.$index, props.data)"
                :underline="false"
              >
                {{ scope.row[column.key] }}
              </el-link>
            </template>
            <!-- 默认文本渲染 -->
            <template v-else>
              <span>{{ scope.row[column.key] }}</span>
            </template>

            <!-- 复制功能 -->
            <el-icon
              v-if="column.copy"
              class="copy-icon"
              @click="handleCopy(scope.row[column.key], column)"
            >
              <CopyDocument />
            </el-icon>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="props.action && props.action.length > 0"
        :width="actionConfig.width"
        :fixed="actionConfig.fixed"
        :label="actionConfig.label"
        :align="actionConfig.align"
        :show-overflow-tooltip="actionConfig.showOverflowTooltip"
      >
        <template #default="scope">
          <div class="action-buttons">
            <template v-for="(action, index) in props.action" :key="index">
              <!-- 权限判断 -->
              <template
                v-if="!action.permission || hasPermission(action.permission)"
              >
                <el-button
                  :type="action.type || 'primary'"
                  :link="action.link || true"
                  :text="action.textBtn"
                  :size="action.size || 'small'"
                  :icon="action.icon"
                  :disabled="
                    typeof action.disabled === 'function'
                      ? action.disabled(scope.row, scope.$index)
                      : action.disabled
                  "
                  @click="action.action(scope.row, scope.$index, props.data)"
                  class="action-btn"
                >
                  {{ action.text }}
                </el-button>
              </template>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="table-pagination" v-if="props.pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="props.pagination.total || 0"
        :page-sizes="props.pagination.pageSizes || [10, 20, 50, 100]"
        :layout="
          props.pagination.layout ||
          'total, sizes, ->, prev, pager, next, jumper'
        "
        :background="props.pagination.background || true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <slot name="pagination"></slot>
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts" name="Table">
import { ref, computed } from 'vue';
import { ElMessage, ElTable } from 'element-plus';
import { CopyDocument } from '@element-plus/icons-vue';
import { useClipboard } from '@/hooks/useClipboard';
import type {
  TableProps,
  TableColumn,
  TableAction,
  TableActionConfig,
} from './types';

// 定义组件属性
const props = withDefaults(defineProps<TableProps>(), {
  columns: () => [],
  action: () => [],
  currentPage: 1,
  pageSize: 10,
  align: 'left',
  headerAlign: 'left',
  showOverflowTooltip: true,
  pagination: undefined,
  selection: false,
  index: false,
  expand: false,
  loading: false,
  highlightCurrentRow: false,
});

// 定义事件
const emit = defineEmits<{
  'update:currentPage': [page: number];
  'update:pageSize': [size: number];
  'page-change': [page: number, size: number];
  'selection-change': [selection: any[]];
  'batch-delete': [selection: any[]];
  'sort-change': [sort: any];
  'row-click': [row: any, column: any, event: Event];
  'cell-click': [row: any, column: any, cell: any, event: Event];
}>();

// 计算操作列配置
const actionConfig = computed<TableActionConfig>(() => {
  return {
    width: 180,
    fixed: 'right',
    label: '操作',
    align: 'center',
    showOverflowTooltip: false,
    ...props.actionConfig,
  };
});

// 当前页码和每页条数的响应式变量
const currentPage = ref(props.currentPage);
const pageSize = ref(props.pageSize);

// 监听页码变化
currentPage.value = props.currentPage;
pageSize.value = props.pageSize;

// 表格引用
const tableRef = ref<InstanceType<typeof ElTable>>();

// 选中项
const selections = ref<any[]>([]);

// 自定义渲染组件
const renderComponent = (props: any) => {
  return props.render(props.row, props.column, props.index);
};

// 权限检查函数
const hasPermission = (permission: string | string[]): boolean => {
  // 这里可以根据实际项目的权限系统进行实现
  // 暂时返回true，表示都有权限
  return true;
};

// 复制功能
const { copy, isSupported } = useClipboard();
const handleCopy = (value: any, column: TableColumn) => {
  if (!isSupported.value) {
    ElMessage.error('您的浏览器不支持剪贴板API');
    return;
  }

  if (column.copyFun) {
    column.copyFun(value, column.key, column);
  } else {
    copy(String(value));
    ElMessage.success('复制成功');
  }
};

// 多选变更事件
const handleSelectionChange = (selection: any[]) => {
  selections.value = selection;
  emit('selection-change', selection);
};

// 批量删除事件
const handleBatchDelete = () => {
  emit('batch-delete', selections.value);
};

// 取消选择事件
const handleCancelSelection = () => {
  tableRef.value?.clearSelection();
  emit('selection-change', []);
};

// 排序变更事件
const handleSortChange = (sort: any) => {
  emit('sort-change', sort);
};

// 行点击事件
const handleRowClick = (row: any, column: any, event: Event) => {
  emit('row-click', row, column, event);
};

// 单元格点击事件
const handleCellClick = (row: any, column: any, cell: any, event: Event) => {
  emit('cell-click', row, column, cell, event);
};

// 页码变更事件
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  emit('update:currentPage', page);
  emit('page-change', page, pageSize.value);
};

// 每页条数变更事件
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  emit('update:pageSize', size);
  emit('page-change', currentPage.value, size);
};
</script>

<style lang="scss" scoped>
.table-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.table-tools {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-selection {
  margin-bottom: 16px;
  padding: 12px;
  background-color: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  display: flex;
  align-items: center;
  gap: 12px;

  .selection-info {
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
}

:deep(.el-table) {
  flex: 1;
  width: 100%;

  // 表头样式
  .el-table__header-wrapper {
    th {
      font-weight: 600;
      background-color: var(--el-bg-color-overlay);
    }
  }

  // 行悬停样式
  .el-table__body-wrapper {
    .el-table__row {
      &:hover {
        background-color: var(--el-fill-color-light);
      }
    }
  }
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.action-btn {
  margin: 0;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
}

.copy-icon {
  margin-left: 8px;
  cursor: pointer;
  color: var(--el-color-primary);
  font-size: 14px;

  &:hover {
    color: var(--el-color-primary-light-3);
  }
}

.dict-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 4px;
  border-radius: 50%;
  vertical-align: middle;
}
</style>
