<template>
  <div class="table">
    <el-table :data="props.data" v-bind="$attrs">
      <!-- 复选框 -->
      <el-table-column
        v-if="props.selection"
        v-bind="{
          type: 'selection',
          width: 55,
          fixed: true,
          align: 'center',
        }"
      />
      <!-- 表格主体内容 -->
      <template v-for="(item, index) in props.columns" :key="item.id || index">
        <el-table-column
          :prop="item.field"
          :label="item.label"
          :width="item.width"
        />
      </template>
      <!-- 操作按钮 -->
      <el-table-column
        v-if="props.operator"
        :fixed="props.operatorConfig && props.operatorConfig.fixed"
        :label="(props.operatorConfig && props.operatorConfig.label) || '操作'"
        :min-width="props.operatorConfig && props.operatorConfig.minWidth"
        :width="props.operatorConfig && props.operatorConfig.width"
        :align="(props.operatorConfig && props.operatorConfig.align) || align"
        v-bind="props.operatorConfig && props.operatorConfig.bind"
        class-name="operator"
      >
        <template #default="scope">
          <div
            class="operator_btn"
            :style="props.operatorConfig && props.operatorConfig.style"
          >
            <template v-for="(item, index) in props.operator" :key="index">
              <!-- TODOS: 增加权限判断 -->
              <el-button
                @click="
                  item.action &&
                    item.action(scope.row, scope.$index, props.data)
                "
                v-bind="{
                  type: 'primary',
                  link: true,
                  text: true,
                  size: 'small',
                  ...item.btnStyle,
                  ...$attrs,
                }"
              >
                <span>{{ item.text }}</span>
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts" name="Table">
import { PropType, CSSProperties } from 'vue';
import { ComponentSize, ElTooltipProps } from 'element-plus';
import type { Pagination, TableColumn } from './types';
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
  operator: {
    type: Array,
    default: () => [],
  },
  operatorConfig: {
    type: Object,
    default: () => ({
      fixed: 'right', // 固定列表右边（left则固定在左边）
      width: 180,
      label: '操作',
    }),
  },
  // 分页
  pageSize: {
    type: Number,
    default: 10,
  },
  // 当前页码
  currentPage: {
    type: Number,
    default: 1,
  },
  // 是否超出隐藏
  showOverflowTooltip: {
    type: Boolean,
    default: true,
  },
  // 是否展示分页
  pagination: {
    type: Object as PropType<Pagination>,
    default: (): Pagination | undefined => undefined,
  },
  // 对齐方式
  align: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left',
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
    default: true,
  },
  // 高度
  height: {
    type: [Number, String],
    default: '',
  },
  // 最大高度
  maxHeight: {
    type: [Number, String],
    default: '',
  },
  // 尺寸
  size: {
    type: String as PropType<ComponentSize>,
    validator: (v: ComponentSize) => ['default', 'small', 'large'].includes(v),
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
    default: '',
  },
  // 行的 className 的回调方法或字符串的 className
  rowClassName: {
    type: [Function, String] as PropType<
      (row: Recordable, rowIndex: number) => string | string
    >,
    default: '',
  },
  // 行的 style 的回调方法或Object的Style
  rowStyle: {
    type: [Function, Object] as PropType<
      (row: Recordable, rowIndex: number) => Recordable | CSSProperties
    >,
    default: undefined,
  },
  // 单元格的 className 的回调方法或字符串的 className
  cellClassName: {
    type: [Function, String] as PropType<
      (row: Recordable, column: any, rowIndex: number) => string | string
    >,
    default: '',
  },
  // 单元格的 style 的回调方法或Object的Style
  cellStyle: {
    type: [Function, Object] as PropType<
      (
        row: Recordable,
        column: any,
        rowIndex: number,
      ) => Recordable | CSSProperties
    >,
    default: undefined,
  },
  // 表头行的 className 的回调方法或字符串的 className
  headerRowClassName: {
    type: [Function, String] as PropType<
      (row: Recordable, rowIndex: number) => string | string
    >,
    default: '',
  },
  // 表头行的 style 的回调方法或Object的Style
  headerRowStyle: {
    type: [Function, Object] as PropType<
      (row: Recordable, rowIndex: number) => Recordable | CSSProperties
    >,
    default: undefined,
  },
  // 表头单元格的 className 的回调方法或字符串的 className
  headerCellClassName: {
    type: [Function, String] as PropType<
      (row: Recordable, column: any, rowIndex: number) => string | string
    >,
    default: '',
  },
  // 表头单元格的 style 的回调方法或Object的Style
  headerCellStyle: {
    type: [Function, Object] as PropType<
      (
        row: Recordable,
        column: any,
        rowIndex: number,
      ) => Recordable | CSSProperties
    >,
    default: undefined,
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
  cardBodyStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  cardBodyClass: {
    type: String as PropType<string>,
    default: '',
  },
  cardWrapStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  cardWrapClass: {
    type: String as PropType<string>,
    default: '',
  },
});
</script>

<style lang="scss" scoped></style>
