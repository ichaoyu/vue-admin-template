import { formatDateTime } from '@/utils/date'

/**
 * 生成通用的表格列配置
 * 自动注入 selection、index、createTime 等公共列
 * @param {Object} options
 * @param {Array} options.columns - 业务自定义列，按显示顺序插入
 * @param {Object} [options.selection] - 选择列配置，false 或 { width: 55 } 等
 * @param {Object} [options.index] - 序号列配置，false 或 { label: '序号', width: 60 } 等
 * @param {Object} [options.createTime] - 创建时间列配置，false 或 { minWidth: 180 } 等
 * @param {Object} [options.operation] - 操作列配置，false 或 { width: 160, slot: 'operation' } 等
 * @param {Function} [options.timeFormatter] - 时间格式化函数
 * @returns {Array} 完整的列配置数组
 */
export const useTableColumns = (options) => {
  const {
    columns = [],
    selection = { type: 'selection', width: 55, align: 'center' },
    index = { type: 'index', label: '序号', width: 60, align: 'center' },
    createTime = { prop: 'createTime', label: '创建时间', minWidth: 180 },
    operation = { prop: 'operation', label: '操作', width: 160, align: 'center', fixed: 'right', slot: 'operation' },
    timeFormatter = formatDateTime,
  } = options

  const result = []

  if (selection) result.push(selection)
  if (index) result.push(index)
  result.push(...columns)
  if (createTime) {
    result.push({
      ...createTime,
      formatter: createTime.formatter || ((row) => timeFormatter(row[createTime.prop || 'createTime'])),
    })
  }
  if (operation) result.push(operation)

  return result
}