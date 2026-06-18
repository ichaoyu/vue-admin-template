import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * CRUD 操作管理 Hook
 *
 * 提供增删改查的通用操作，包括新增、编辑、删除、状态切换等
 * 适用于所有管理页面的 CRUD 操作
 *
 * @param {Object} api - API 对象，包含 create, update, delete 等方法
 * @param {Object} options - 配置选项
 * @param {Function} options.afterCreate - 创建成功后的回调
 * @param {Function} options.afterUpdate - 更新成功后的回调
 * @param {Function} options.afterDelete - 删除成功后的回调
 * @param {Function} options.afterStatusChange - 状态切换成功后的回调
 * @param {Function} options.formatFormData - 格式化表单数据的函数
 * @param {string} options.nameField - 名称字段，用于删除确认提示，默认 'name'
 * @param {boolean} options.enableBatchDelete - 是否启用批量删除功能，默认 false
 *
 * @returns {Object} CRUD 相关的状态和方法
 *
 * @example
 * ```javascript
 * const { form, dialogVisible, handleAdd, handleEdit, handleSubmit, handleDelete, handleStatusChange } = useCrud(
 *   { create: createUserAPI, update: updateUserAPI, delete: deleteUserAPI },
 *   { nameField: 'userName' }
 * )
 * ```
 */
export const useCrud = (api, options = {}) => {
  const {
    afterCreate = null,
    afterUpdate = null,
    afterDelete = null,
    afterStatusChange = null,
    formatFormData = null,
    nameField = 'name',
    enableBatchDelete = false,
  } = options

  // #region 状态定义

  const dialogVisible = ref(false)
  const submitLoading = ref(false)
  const form = ref({})
  // 批量操作：选中的行 ID 列表
  const selectedIds = ref([])

  // #endregion

  // #region 新增操作

  /**
   * 打开新增弹窗
   * @param {Object} defaultValues - 表单默认值
   */
  const handleAdd = (defaultValues = {}) => {
    form.value = { ...defaultValues }
    dialogVisible.value = true
  }

  // #endregion

  // #region 编辑操作

  /**
   * 打开编辑弹窗
   * @param {Object} row - 行数据
   * @param {Object} fieldMapping - 字段映射，用于处理字段名不一致的情况
   */
  const handleEdit = (row, fieldMapping = {}) => {
    const formData = { ...row }

    // 处理字段映射
    Object.keys(fieldMapping).forEach((key) => {
      const mappedKey = fieldMapping[key]
      if (row[mappedKey] !== undefined) {
        formData[key] = row[mappedKey]
      }
    })

    // 格式化表单数据
    form.value = formatFormData ? formatFormData(formData) : formData
    dialogVisible.value = true
  }

  // #endregion

  // #region 提交操作

  /**
   * 提交表单
   * @param {Object} formData - 表单数据
   * @param {Object} formRef - 表单引用，用于验证
   * @param {Function} onSuccess - 成功后的回调（如刷新列表）
   */
  const handleSubmit = async (formData, formRef = null, onSuccess = null) => {
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
      const id = formData.id

      if (id) {
        // 更新
        await api.update(id, formData)
        ElMessage.success('修改成功')
        afterUpdate?.(formData)
      } else {
        // 新增
        await api.create(formData)
        ElMessage.success('新增成功')
        afterCreate?.(formData)
      }

      dialogVisible.value = false
      onSuccess?.()
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      submitLoading.value = false
    }
  }

  // #endregion

  // #region 删除操作

  /**
   * 删除数据
   * @param {Object} row - 行数据
   * @param {Function} onSuccess - 成功后的回调（如刷新列表）
   * @param {string} customMessage - 自定义确认消息
   */
  const handleDelete = async (row, onSuccess = null, customMessage = null) => {
    const id = row.id
    const name = row[nameField] || '该数据'

    const message = customMessage || `确认要删除"${name}"吗？`

    try {
      await ElMessageBox.confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      await api.delete(id)
      ElMessage.success('删除成功')
      afterDelete?.(row)
      onSuccess?.()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除失败:', error)
      }
    }
  }

  // #endregion

  // #region 状态切换操作

  /**
   * 切换状态
   * @param {Object} row - 行数据
   * @param {string} statusField - 状态字段名，默认 'status'
   * @param {Function} onSuccess - 成功后的回调
   */
  const handleStatusChange = async (row, statusField = 'status', onSuccess = null) => {
    const id = row.id

    if (!id) {
      // 没有ID时恢复状态
      row[statusField] = row[statusField] === '0' ? '1' : '0'
      return
    }

    try {
      await api.update(id, { [statusField]: row[statusField] })
      ElMessage.success('状态更新成功')
      afterStatusChange?.(row)
      onSuccess?.()
    } catch (error) {
      // 失败时恢复状态
      row[statusField] = row[statusField] === '0' ? '1' : '0'
      console.error('状态更新失败:', error)
    }
  }

  // #endregion

  // #region 批量操作

  /**
   * 处理表格选择变化（与 el-table 的 @selection-change 事件配合使用）
   * @param {Array} selection - 当前选中的行数据数组
   */
  const handleSelectionChange = (selection) => {
    selectedIds.value = selection.map((item) => item.id)
  }

  /**
   * 批量删除
   * @param {Function} batchDeleteAPI - 批量删除 API 函数，接收 ids 数组参数
   * @param {Function} onSuccess - 成功后的回调（如刷新列表）
   */
  const handleBatchDelete = async (batchDeleteAPI, onSuccess = null) => {
    // 检查是否有选中的数据
    if (!selectedIds.value || selectedIds.value.length === 0) {
      ElMessage.warning('请选择要删除的数据')
      return
    }

    try {
      // 显示确认对话框
      await ElMessageBox.confirm(
        `确认要删除选中的 ${selectedIds.value.length} 条数据吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )

      // 调用批量删除 API，传递 ids 数组
      await batchDeleteAPI(selectedIds.value)

      ElMessage.success('删除成功')
      onSuccess?.()

      // 清空选中状态
      selectedIds.value = []
    } catch (error) {
      // 用户取消操作时不打印错误
      if (error !== 'cancel') {
        console.error('批量删除失败:', error)
        ElMessage.error('批量删除失败，请重试')
      }
    }
  }

  // #endregion

  return {
    // 状态
    form,
    dialogVisible,
    submitLoading,
    selectedIds,

    // 方法
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
