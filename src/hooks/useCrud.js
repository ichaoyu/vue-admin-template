import { ElMessage, ElMessageBox } from 'element-plus'
import { STATUS } from '@/constants'
import { useTable } from './useTable'

/**
 * CRUD 操作管理 Hook
 *
 * 集成 useTable，一个调用即可获得列表页全部逻辑：表格数据 + CRUD 操作
 * 单独使用 useTable 仍可用于只读列表页等场景
 *
 * @param {Function} fetchAPI - 列表查询 API 函数
 * @param {Object} apiMap - API 映射
 * @param {Function} apiMap.create - 新增 API
 * @param {Function} apiMap.update - 更新 API，签名 update(data)
 * @param {Function} apiMap.delete - 删除 API
 * @param {Function} [apiMap.batchDelete] - 批量删除 API（可选）
 * @param {Object} options - 配置选项
 * @param {string} [options.nameField='name'] - 删除确认时显示的名称字段
 * @param {Object} [options.formDefaults={}] - 表单默认值
 * @param {Object} [options.defaultParams={}] - 默认查询参数（透传给 useTable）
 * @param {number} [options.defaultPageSize=10] - 默认每页条数（透传给 useTable）
 * @param {Function} [options.formatFormData] - handleEdit 时格式化行数据
 * @param {Function} [options.formatSubmitData] - 提交前格式化表单数据
 * @param {Function} [options.afterCreate] - 创建成功后回调
 * @param {Function} [options.afterUpdate] - 更新成功后回调
 * @param {Function} [options.afterDelete] - 删除成功后回调
 * @param {Function} [options.afterSubmit] - 提交成功后回调（新增/更新通用）
 *
 * @returns {Object} useTable 全部返回值 + CRUD 状态和方法
 *
 * @example
 * ```javascript
 * const { tableData, loading, total, form, dialogVisible, handleAdd, handleEdit, handleSubmit, handleDelete } = useCrud(
 *   getUserListAPI,
 *   { create: createUserAPI, update: updateUserAPI, delete: deleteUserAPI },
 *   { nameField: 'userName', formDefaults: { status: 1 } }
 * )
 * ```
 */
export const useCrud = (fetchAPI, apiMap, options = {}) => {
  const {
    nameField = 'name',
    formDefaults = {},
    defaultParams = {},
    defaultPageSize = 10,
    formatFormData = null,
    formatSubmitData = null,
    afterCreate = null,
    afterUpdate = null,
    afterDelete = null,
    afterSubmit = null,
  } = options

  // #region useTable 集成

  const tableState = useTable(fetchAPI, {
    defaultParams,
    defaultPageSize,
    immediate: true,
  })

  // #endregion

  // #region 状态定义

  const dialogVisible = ref(false)
  const submitLoading = ref(false)
  const form = ref({ ...formDefaults })
  const selectedIds = ref([])

  // #endregion

  // #region 表单重置

  /**
   * 重置表单到默认值
   */
  const resetForm = () => {
    form.value = { ...formDefaults }
  }

  // #endregion

  // #region 新增操作

  /**
   * 打开新增弹窗
   */
  const handleAdd = () => {
    resetForm()
    dialogVisible.value = true
  }

  // #endregion

  // #region 编辑操作

  /**
   * 打开编辑弹窗
   * @param {Object} row - 行数据
   */
  const handleEdit = (row) => {
    const formData = formatFormData ? formatFormData(row) : { ...row }
    form.value = formData
    dialogVisible.value = true
  }

  // #endregion

  // #region 提交操作

  /**
   * 提交表单
   * @param {Object} formRef - el-form 引用，用于验证
   */
  const handleSubmit = async (formRef) => {
    // 表单验证
    if (formRef) {
      try {
        await formRef.validate()
      } catch {
        return
      }
    }

    submitLoading.value = true

    try {
      const submitData = formatSubmitData ? formatSubmitData(form.value) : form.value
      const id = submitData.id

      if (id) {
        // 更新
        await apiMap.update(submitData)
        ElMessage.success('修改成功')
        afterUpdate?.(submitData)
      } else {
        // 新增
        await apiMap.create(submitData)
        ElMessage.success('新增成功')
        afterCreate?.(submitData)
      }

      afterSubmit?.(submitData)
      dialogVisible.value = false
      tableState.getData()
    } catch (error) {
      // 错误由 axios 拦截器统一处理
    } finally {
      submitLoading.value = false
    }
  }

  // #endregion

  // #region 删除操作

  /**
   * 删除数据
   * @param {Object} row - 行数据
   */
  const handleDelete = async (row) => {
    const id = row.id
    const name = row[nameField] || '该数据'

    try {
      await ElMessageBox.confirm(`确认要删除"${name}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      await apiMap.delete(id)
      ElMessage.success('删除成功')
      afterDelete?.(row)
      tableState.getData()
    } catch (error) {
      if (error !== 'cancel') {
        // 错误由 axios 拦截器统一处理
      }
    }
  }

  // #endregion

  // #region 状态切换操作

  /**
   * 切换状态
   * @param {Object} row - 行数据
   * @param {string} statusField - 状态字段名，默认 'status'
   */
  const handleStatusChange = async (row, statusField = 'status') => {
    const id = row.id
    const oldStatus = row[statusField]

    if (!id) {
      // 没有 ID 时恢复状态
      row[statusField] = oldStatus === STATUS.DISABLED ? STATUS.NORMAL : STATUS.DISABLED
      return
    }

    try {
      await apiMap.update({ id, [statusField]: row[statusField] })
      ElMessage.success('状态更新成功')
    } catch (error) {
      // 失败时恢复状态
      row[statusField] = oldStatus === STATUS.DISABLED ? STATUS.NORMAL : STATUS.DISABLED
    }
  }

  // #endregion

  // #region 批量操作

  /**
   * 处理表格选择变化
   * @param {Array} selection - 当前选中的行数据数组
   */
  const handleSelectionChange = (selection) => {
    selectedIds.value = selection.map((item) => item.id)
  }

  /**
   * 批量删除
   */
  const handleBatchDelete = async () => {
    if (!apiMap.batchDelete) {
      console.warn('useCrud: batchDelete API 未配置')
      return
    }

    if (!selectedIds.value || selectedIds.value.length === 0) {
      ElMessage.warning('请选择要删除的数据')
      return
    }

    try {
      await ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      await apiMap.batchDelete(selectedIds.value)
      ElMessage.success('删除成功')
      selectedIds.value = []
      tableState.getData()
    } catch (error) {
      if (error !== 'cancel') {
        // 错误由 axios 拦截器统一处理
      }
    }
  }

  // #endregion

  return {
    // useTable 状态
    ...tableState,

    // CRUD 状态
    form,
    dialogVisible,
    submitLoading,
    selectedIds,

    // CRUD 方法
    resetForm,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleStatusChange,
    handleSelectionChange,
    handleBatchDelete,
  }
}

export default useCrud
