/**
 * 表单管理 Hook
 *
 * 提供表单的状态管理、验证、重置等功能
 * 适用于所有需要表单操作的场景
 *
 * @param {Object} options - 配置选项
 * @param {Object} options.defaultValues - 表单默认值
 * @param {Object} options.rules - 表单验证规则
 *
 * @returns {Object} 表单相关的状态和方法
 *
 * @example
 * ```javascript
 * const { form, formRef, rules, validate, resetForm, setFormData } = useForm({
 *   defaultValues: { name: '', status: '0' },
 *   rules: { name: [{ required: true, message: '请输入名称' }] }
 * })
 * ```
 */
export const useForm = (options = {}) => {
  const { defaultValues = {}, rules = {} } = options

  // #region 状态定义

  const formRef = ref(null)
  const form = reactive({ ...defaultValues })
  const loading = ref(false)

  // #endregion

  // #region 表单操作

  /**
   * 验证表单
   * @returns {Promise<boolean>} 验证结果
   */
  const validate = async () => {
    if (!formRef.value) return true

    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  /**
   * 重置表单
   * @param {Object} newValues - 重置后的值，默认为 defaultValues
   */
  const resetForm = (newValues = {}) => {
    Object.keys(form).forEach((key) => {
      delete form[key]
    })
    Object.assign(form, { ...defaultValues, ...newValues })
    formRef.value?.resetFields?.()
  }

  /**
   * 设置表单数据
   * @param {Object} data - 表单数据
   */
  const setFormData = (data) => {
    Object.keys(form).forEach((key) => {
      if (data[key] !== undefined) {
        form[key] = data[key]
      }
    })
  }

  /**
   * 获取表单数据（去除空值）
   * @param {Array} excludeKeys - 排除的键
   * @returns {Object} 表单数据
   */
  const getFormData = (excludeKeys = []) => {
    const data = {}
    Object.keys(form).forEach((key) => {
      if (!excludeKeys.includes(key) && form[key] !== '' && form[key] !== null && form[key] !== undefined) {
        data[key] = form[key]
      }
    })
    return data
  }

  /**
   * 清除验证结果
   * @param {Array} props - 指定清除的字段，不传则清除所有
   */
  const clearValidate = (props = undefined) => {
    formRef.value?.clearValidate?.(props)
  }

  // #endregion

  // #region 提交处理

  /**
   * 提交表单
   * @param {Function} submitFn - 提交函数
   * @param {Object} options - 配置选项
   * @param {string} options.successMessage - 成功消息
   * @param {Function} options.onSuccess - 成功回调
   * @param {Function} options.onError - 错误回调
   */
  const submit = async (submitFn, options = {}) => {
    const { successMessage = '操作成功', onSuccess, onError } = options

    const isValid = await validate()
    if (!isValid) return

    loading.value = true

    try {
      await submitFn(form)
      if (successMessage) {
        // ElMessage.success(successMessage)
      }
      onSuccess?.()
    } catch (error) {
      console.error('提交失败:', error)
      onError?.(error)
    } finally {
      loading.value = false
    }
  }

  // #endregion

  return {
    // 状态
    formRef,
    form,
    rules,
    loading,

    // 方法
    validate,
    resetForm,
    setFormData,
    getFormData,
    clearValidate,
    submit,
  }
}

export default useForm
