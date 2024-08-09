<template>
  <div class="table">
    <div class="table-tools">
      <div class="tools-bar">
        <!-- 表格外操作 -->
        <slot name="toolbar"></slot>
      </div>
      <div class="tools-column">
        <div class="tools-column-selection">
          <template v-if="selections.length > 0">
            <div class="select-num">
              <span
                >已选择 {{ selections.length }}/{{ props.data.length }}</span
              >
              <el-tooltip placement="top" content="取消选择">
                <IconFont
                  class="icon-close"
                  icon="CircleCloseFilled"
                  @click="onCancelSelection"
                />
              </el-tooltip>
            </div>
            <slot name="selections"></slot>
            <el-button type="danger" @click="onBatchDelete">批量删除</el-button>
          </template>
        </div>
        <div class="tools-column-opr">
          <!-- 表格大小 -->
          <ToolsTableSize
            :size="tableSize"
            @change-table-size="onChangeTableSize"
          />
          <!-- 列设置 -->
          <ToolsColumnsToggle
            :columns="columnsSettings"
            @change-columns="onChangeColumns"
          />
        </div>
      </div>
    </div>
    <el-table
      ref="commonTableRef"
      class="table-body"
      :data="props.data"
      :height="props.height"
      v-bind="$attrs"
      :size="tableSize"
      :highlight-current-row="props.highlightCurrentRow"
      :empty-text="props.emptyText"
      :show-overflow-tooltip="props.showOverflowTooltip"
      @selection-change="handleSelectionChange"
    >
      <!-- 复选框 -->
      <el-table-column
        v-if="props.selection"
        v-bind="{
          type: 'selection',
          width: 45,
          fixed: true,
        }"
      />
      <!-- 序号 -->
      <el-table-column
        v-if="props.index"
        v-bind="{
          type: 'index',
          width: 60,
          fixed: true,
          label: '序号',
        }"
      />
      <!-- 表格主体内容 -->
      <template v-for="item in columnsSettings" :key="item.key">
        <el-table-column
          :label="item.label"
          :width="item.width"
          :type="item.type"
          :prop="item.key"
          :min-width="item['min-width'] || item.minWidth"
          :sortable="item.sortable"
          :align="item.align"
          :fixed="item.fixed"
        >
          <template #header>{{ item.label }}</template>
          <template #default="scope">
            <!-- 自定义插槽 -->
            <template v-if="item.slotName">
              <slot :name="item.slotName" :scope="scope"></slot>
            </template>
            <!-- 自定义渲染 -->
            <template v-if="item.render">
              <render
                :column="item"
                :row="scope.row"
                :render="item.render"
                :index="scope.$index"
              />
            </template>
            <!-- 字典map -->
            <template v-if="item.dictMap">
              <i
                v-if="item.dictMap.color"
                class="dict-dot"
                :style="{
                  backgroundColor: item.dictMap.color[scope.row[item.key]],
                }"
              ></i
              >{{ item.dictMap.value[scope.row[item.key]] }}
            </template>

            <!-- 链接查看 -->
            <el-link
              v-if="item.oprAction"
              class="view-link"
              type="primary"
              @click="item.oprAction(scope.row, scope.$index, props.data)"
              >{{ scope.row[item.key] }}</el-link
            >
            <!-- 文本 -->
            <template
              v-if="
                !item.render &&
                !item.slotName &&
                !item.dictMap &&
                !item.oprAction
              "
              ><span>{{ scope.row[item.key] }}</span></template
            >
            <!-- 复制 -->
            <icon-font
              v-if="item.copy"
              class="icon-btn-copy"
              name="copy"
              :size="14"
              @click="
                item.copyFun
                  ? item.copyFun(scope.row[item.key], item.key, scope.row)
                  : onCopyItem(scope.row[item.key])
              "
            />
          </template>
        </el-table-column>
      </template>
      <!-- 操作按钮 -->
      <el-table-column v-if="props.action.length > 0" v-bind="actionCfg">
        <template #default="scope">
          <div class="operator_btn" :style="actionCfg && actionCfg.style">
            <template v-for="(opr, opridx) in props.action" :key="opridx">
              <!-- TODOS: 增加权限判断 -->
              <el-button
                @click="
                  opr.action && opr.action(scope.row, scope.$index, props.data)
                "
                v-bind="{
                  type: 'primary',
                  link: true,
                  text: true,
                  size: 'small',
                  ...opr.btnStyle,
                  ...$attrs,
                }"
              >
                <span>{{ opr.text }}</span>
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="props.pagination"
      class="table-pagination"
      background
      :size="tableSize"
      v-model:current-page="$props.currentPage"
      v-model:page-size="$props.pageSize"
      :page-sizes="[10, 20, 50, 100, 200]"
      layout="total, sizes, ->, prev, pager, next, jumper"
      :hide-on-single-page="false"
      @current-change="onPageChange"
      @update:page-size="onChangePageSize"
      v-bind="props.pagination"
    >
      <slot name="pagination"></slot>
    </el-pagination>
  </div>
</template>

<script setup lang="ts" name="Table">
import { ElTooltipProps, ElMessage, ElTable } from 'element-plus';
import { useClipboard } from '@/hooks/useClipboard';
import ToolsTableSize from './ToolsTableSize.vue';
import ToolsColumnsToggle from './ToolsColumnsToggle.vue';
import render from './render.vue';
import {
  Pagination,
  TableColumn,
  TableAction,
  TableActionConfig,
} from './types';
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  // 多选框
  selection: {
    type: Boolean,
    default: false,
  },
  // 序号
  index: {
    type: Boolean,
    default: false,
  },

  // 每页数量
  pageSize: {
    type: Number,
    default: 10,
  },
  // 当前页码
  currentPage: {
    type: Number,
    default: 1,
  },
  // 分页配置
  pagination: {
    type: Object as PropType<Pagination>,
    default: (): Pagination | undefined => undefined,
  },
  // 是否超出隐藏
  showOverflowTooltip: {
    type: Boolean,
    default: true,
  },
  // 对齐方式
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left',
  },
  // 操作列
  action: {
    type: Array as PropType<TableAction[]>,
    default: () => [],
  },
  // 操作列配置
  actionConfig: {
    type: Object as PropType<TableActionConfig>,
    default: () => ({
      width: 180,
      fixed: 'right',
      label: '操作',
      align: 'center',
    }),
  },
  // 表头对齐方式
  headerAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left',
  },
  // 表头
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => [],
  },
  // 表格数据
  data: {
    type: Array as PropType<Recordable[]>,
    default: () => [],
  },
  // 条纹
  stripe: {
    type: Boolean,
    default: false,
  },
  // 边框
  border: {
    type: Boolean,
    default: false,
  },
  // 高度
  height: {
    type: [Number, String],
    // default: 'var(--table-height)',
    default: '100%',
  },
  // 最大高度
  maxHeight: {
    type: [Number, String],
    default: '800',
  },
  // 尺寸
  size: {
    type: String as PropType<ElementSize>,
    default: 'small',
  },
  // 列宽是否自动撑开
  fit: {
    type: Boolean,
    default: true,
  },
  // 是否显示表头
  showHeader: {
    type: Boolean,
    default: true,
  },
  // 是否要高亮当前行
  highlightCurrentRow: {
    type: Boolean,
    default: false,
  },
  // current-row-key	当前行的 key，只写属性
  currentRowKey: {
    type: [Number, String],
    default: 'id',
  },
  // 行的 className 的回调方法或字符串的 className
  rowClassName: {
    type: [Function, String] as PropType<
      (row: Recordable, rowIndex: number) => string | string
    >,
    default: '',
  },

  // 单元格的 className 的回调方法或字符串的 className
  cellClassName: {
    type: [Function, String] as PropType<
      (row: Recordable, column: any, rowIndex: number) => string | string
    >,
    default: '',
  },

  // 表头行的 className 的回调方法或字符串的 className
  headerRowClassName: {
    type: [Function, String] as PropType<
      (row: Recordable, rowIndex: number) => string | string
    >,
    default: '',
  },

  // 表头单元格的 className 的回调方法或字符串的 className
  headerCellClassName: {
    type: [Function, String] as PropType<
      (row: Recordable, column: any, rowIndex: number) => string | string
    >,
    default: '',
  },

  // 行数据的 Key，用来优化 Table 的渲染
  rowKey: {
    type: String,
    default: 'id',
  },
  emptyText: {
    type: String,
    defalut: '暂无数据',
  },
  // 是否默认展开所有行
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  // 设置 Table 目前的展开行，需要设置 row-key 属性才能使用
  expandRowKeys: {
    type: Array as PropType<string[]>,
    default: undefined,
  },
  // 默认的排序列的 prop 和顺序
  defaultSort: {
    type: Object as PropType<{ prop: string; order: string }>,
    default: () => ({}),
  },
  // 溢出的 tooltip 的 effect
  tooltipEffect: {
    type: String as PropType<'dark' | 'light'>,
    default: 'dark',
  },
  // 溢出 tooltip 的选项
  tooltipOptions: {
    type: Object as PropType<
      Pick<
        ElTooltipProps,
        | 'effect'
        | 'enterable'
        | 'hideAfter'
        | 'offset'
        | 'placement'
        | 'popperClass'
        | 'popperOptions'
        | 'showAfter'
        | 'showArrow'
      >
    >,
    default: () => ({
      enterable: true,
      placement: 'top',
      showArrow: true,
      hideAfter: 200,
      popperOptions: { strategy: 'fixed' },
    }),
  },
  // 是否在表尾显示合计行
  showSummary: {
    type: Boolean,
    default: false,
  },
  // 显示摘要行第一列的文本
  sumText: {
    type: String,
    default: 'Sum',
  },
  // 自定义的合计计算方法
  summaryMethod: {
    type: Function as PropType<
      (param: { columns: any[]; data: any[] }) => any[]
    >,
    default: undefined,
  },
  // 合并行或列的计算方法
  spanMethod: {
    type: Function as PropType<
      (param: {
        row: any;
        column: any;
        rowIndex: number;
        columnIndex: number;
      }) => any[]
    >,
    default: undefined,
  },
  // 部分行被选中
  selectOnIndeterminate: {
    type: Boolean,
    default: true,
  },
  // 树节点的缩进
  indent: {
    type: Number,
    default: 16,
  },
  // 是否懒加载子节点数据
  lazy: {
    type: Boolean,
    default: false,
  },
  // 加载子节点数据的函数，lazy 为 true 时生效
  load: {
    type: Function as PropType<
      (row: Recordable, treeNode: any, resolve: Function) => void
    >,
    default: undefined,
  },
  // 渲染嵌套数据的配置选项
  treeProps: {
    type: Object as PropType<{
      hasChildren?: string;
      children?: string;
      label?: string;
    }>,
    default: () => ({
      hasChildren: 'hasChildren',
      children: 'children',
      label: 'label',
    }),
  },
  // 设置表格单元、行和列的布局方式
  tableLayout: {
    type: String as PropType<'auto' | 'fixed'>,
    default: 'fixed',
  },
  // 总是显示滚动条
  scrollbarAlwaysOn: {
    type: Boolean,
    default: false,
  },
  // 确保主轴的最小尺寸，以便不超过内容
  flexible: {
    type: Boolean,
    default: false,
  },
  // 自定义内容
  customContent: {
    type: Boolean,
    default: false,
  },

  cardBodyClass: {
    type: String as PropType<string>,
    default: '',
  },

  cardWrapClass: {
    type: String as PropType<string>,
    default: '',
  },
});
const actionCfg = computed(() =>
  Object.assign(
    {
      width: 150,
      fixed: 'right',
      label: '操作',
      align: 'center',
    },
    props.actionConfig,
  ),
);

// 抛出事件
const emits = defineEmits(['page-change', 'batch-delete', 'selections-change']);

// 页码变更
const onPageChange = (page: number) => {
  emits('page-change', { page });
};
// 每页显示数量变更
const onChangePageSize = (size: number) => {
  emits('page-change', { size });
};
// table大小
const tableSize = ref<ElementSize>(props.size);
const onChangeTableSize = (size: ElementSize) => {
  tableSize.value = size;
};
// 显隐列
const columnsSettings = ref<TableColumn[]>(props.columns);
const onChangeColumns = (columns: TableColumn[]) => {
  columnsSettings.value = columns;
};

// 复制
// 复制
const { copy, copied, isSupported } = useClipboard();
const onCopyItem = (row: string) => {
  if (!isSupported.value) {
    ElMessage.error('你的浏览器不支持 Clipboard API');
    return;
  }
  copy(row);
  copied && ElMessage.success('复制成功');
};
// 批量
const selections = ref<any[]>([]);
// 删除
const onBatchDelete = () => {
  emits('batch-delete', selections.value);
};
// 选项变动
const handleSelectionChange = (val: any[]) => {
  selections.value = val;
  emits('selections-change', val);
};
// 取消选择
const commonTableRef = ref<InstanceType<typeof ElTable>>();
const onCancelSelection = () => {
  commonTableRef.value!.clearSelection();
  emits('selections-change', []);
};
</script>

<style lang="scss" scoped>
.el-table {
  --el-table-header-text-color: var(--el-text-color-primary);
  --el-table-header-bg-color: var(--el-bg-color-overlay);
  --el-table-tr-bg-color: var(--el-bg-color-overlay);
  --el-table-row-hover-bg-color: var(--bg-global-color);
}

.el-pagination {
  --el-pagination-font-size: 12px;
}

:deep(.el-select__wrapper) {
  font-size: 12px;
}

.view-link {
  font-size: 12px;
}

.el-select {
  --el-select-input-font-size: 12px;
}

.el-table__cell {
  &:hover {
    .icon-btn-copy {
      visibility: visible;
    }
  }
}

.table {
  @include flex-layout($direction: column, $align: flex-start);

  height: 100%;

  &-tools {
    width: 100%;

    .tools-column {
      @include flex-layout($justify: space-between);

      min-height: 30px;
      gap: 10px;

      &-selection {
        @include flex-layout();

        gap: 10px;

        .select-num {
          @include flex-layout();

          gap: 10px;
          margin-right: 20px;
          color: var(--el-text-color-regular);
          font-size: 12px;

          .icon-close {
            @extend %item-hover;
          }
        }
      }

      &-opr {
        @include flex-layout();

        gap: 10px;
        align-self: flex-end;
      }
    }
  }

  &-body {
    flex: 1;
    width: 100%;
  }

  &-pagination {
    align-self: flex-end;
    height: var(--pagination-height);
    margin-top: 10px;
  }

  .icon-btn-copy {
    @extend %item-hover;

    visibility: hidden;
    position: absolute;
    z-index: 999;
    top: 30%;
    right: 0;
    margin-left: 6px;
  }

  .dict-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 4px;
    border-radius: 100%;
  }
}
</style>
