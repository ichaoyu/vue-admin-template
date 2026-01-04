import type { TableProps as ElTableProps, PaginationProps } from 'element-plus';

/**
 * 操作按钮配置
 */
export interface TableAction {
  text: string; // 按钮文字
  action: (row: any, index: number, data: any[]) => void; // 点击事件
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'; // 按钮类型
  link?: boolean; // 是否为链接按钮
  textBtn?: boolean; // 是否为文字按钮
  size?: '' | 'default' | 'small' | 'large'; // 按钮大小 (Element Plus按钮支持的大小)
  icon?: string; // 按钮图标
  disabled?: boolean | ((row: any, index: number) => boolean); // 是否禁用
  permission?: string | string[]; // 权限标识
}

/**
 * 操作列配置
 */
export interface TableActionConfig {
  width?: number | string; // 列宽
  fixed?: 'left' | 'right'; // 是否固定
  label?: string; // 列标题
  align?: 'left' | 'center' | 'right'; // 对齐方式
  showOverflowTooltip?: boolean; // 是否显示溢出提示
}

/**
 * 表格列配置
 */
export interface TableColumn {
  key: string; // 字段名
  label?: string; // 列标题
  type?: 'selection' | 'index' | 'expand'; // 列类型
  width?: number | string; // 列宽
  minWidth?: number | string; // 最小列宽
  fixed?: 'left' | 'right'; // 是否固定
  sortable?: boolean | 'custom'; // 是否可排序
  align?: 'left' | 'center' | 'right'; // 对齐方式
  headerAlign?: 'left' | 'center' | 'right'; // 表头对齐方式
  showOverflowTooltip?: boolean; // 是否显示溢出提示
  formatter?: (row: any, column: any, cellValue: any, index: number) => any; // 格式化函数
  slotName?: string; // 自定义插槽名称
  render?: (row: any, column: any, index: number) => any; // 自定义渲染函数
  copy?: boolean; // 是否可复制
  copyFun?: (value: any, key: string, row: any) => void; // 自定义复制函数
  dictMap?: {
    value: Record<string, any>; // 字典值映射
    color?: Record<string, string>; // 字典颜色映射
  }; // 字典映射
  oprAction?: (row: any, index: number, data: any[]) => void; // 点击事件
  children?: TableColumn[]; // 子列（多级表头）
  [key: string]: any; // 其他Element Plus列属性
}

/**
 * 表格属性
 */
export interface TableProps extends Partial<ElTableProps<any[]>> {
  columns?: TableColumn[]; // 列配置
  data: any[]; // 表格数据
  action?: TableAction[]; // 操作按钮配置
  actionConfig?: TableActionConfig; // 操作列配置
  pagination?: PaginationProps | boolean; // 分页配置，为true时使用默认配置
  currentPage?: number; // 当前页码
  pageSize?: number; // 每页条数
  index?: boolean; // 是否显示序号列
  selection?: boolean; // 是否显示多选列
  expand?: boolean; // 是否显示展开列
  loading?: boolean; // 加载状态
  align?: 'left' | 'center' | 'right'; // 对齐方式
  headerAlign?: 'left' | 'center' | 'right'; // 表头对齐方式
  showOverflowTooltip?: boolean; // 是否显示溢出提示
  highlightCurrentRow?: boolean; // 是否高亮当前行
}
