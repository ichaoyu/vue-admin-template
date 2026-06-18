/**
 * 表格数据管理 Hook
 *
 * 提供表格数据的获取、分页、刷新等通用功能
 * 适用于所有需要分页列表的管理页面
 *
 * @param {Function} fetchAPI - 获取数据的 API 函数
 * @param {Object} options - 配置选项
 * @param {Object} options.defaultParams - 默认查询参数
 * @param {number} options.defaultPageSize - 默认每页条数，默认 10
 * @param {boolean} options.immediate - 是否立即执行，默认 true
 * @param {Function} options.beforeFetch - 请求前的数据处理函数
 * @param {Function} options.afterFetch - 请求后的数据处理函数
 * @param {Function} options.onError - 错误处理函数
 *
 * @returns {Object} 表格相关的状态和方法
 *
 * @example
 * ```javascript
 * const { tableData, loading, total, queryParams, getData, handlePageChange } = useTable(getUserListAPI, {
 *   defaultParams: { userName: '', status: '' }
 * })
 * ```
 */
export const useTable = (fetchAPI, options = {}) => {
  const {
    defaultParams = {},
    defaultPageSize = 10,
    immediate = true,
    beforeFetch = null,
    afterFetch = null,
    onError = null,
  } = options

  // #region 状态定义

  const loading = ref(false)
  const tableData = ref([])
  const total = ref(0)

  const queryParams = reactive({
    pageNum: 1,
    pageSize: defaultPageSize,
    ...defaultParams,
  })

  // #endregion

  // #region 数据获取

  /**
   * 获取表格数据
   * @param {Object} extraParams - 额外的查询参数
   */
  const getData = async (extraParams = {}) => {
    loading.value = true

    try {
      // 合并查询参数，过滤空值
      const params = {}

      const allParams = { ...queryParams, ...extraParams }
      Object.keys(allParams).forEach((key) => {
        const value = allParams[key]
        if (value !== '' && value !== null && value !== undefined) {
          params[key] = value
        }
      })

      // 请求前处理
      const finalParams = beforeFetch ? beforeFetch(params) : params

      // 发送请求
      const res = await fetchAPI(finalParams)

      // 请求后处理
      const result = afterFetch ? afterFetch(res) : res

      // 设置数据
      tableData.value = result?.list || result || []
      total.value = result?.total || 0
    } catch (error) {
      console.error('获取数据失败:', error)
      if (onError) {
        onError(error)
      }
    } finally {
      loading.value = false
    }
  }

  // #endregion

  // #region 分页处理

  /**
   * 页码改变处理
   * @param {number} page - 新页码
   */
  const handlePageChange = (page) => {
    queryParams.pageNum = page
    getData()
  }

  /**
   * 每页条数改变处理
   * @param {number} size - 新的每页条数
   */
  const handleSizeChange = (size) => {
    queryParams.pageSize = size
    queryParams.pageNum = 1
    getData()
  }

  // #endregion

  // #region 搜索和刷新

  /**
   * 刷新数据（保持当前页）
   */
  const handleRefresh = () => {
    getData()
  }

  /**
   * 重置并搜索（回到第一页）
   */
  const handleSearch = () => {
    queryParams.pageNum = 1
    getData()
  }

  /**
   * 重置查询参数
   * @param {Object} resetValues - 重置后的值，默认为 defaultParams
   */
  const resetQuery = (resetValues = {}) => {
    Object.assign(queryParams, {
      pageNum: 1,
      pageSize: defaultPageSize,
      ...defaultParams,
      ...resetValues,
    })
    getData()
  }

  // #endregion

  // #region 生命周期

  if (immediate) {
    onMounted(() => {
      getData()
    })
  }

  // #endregion

  return {
    // 状态
    loading,
    tableData,
    total,
    queryParams,

    // 方法
    getData,
    handlePageChange,
    handleSizeChange,
    handleRefresh,
    handleSearch,
    resetQuery,
  }
}

export default useTable
