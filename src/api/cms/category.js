import api from '@/utils/axios'

// #region 栏目管理接口

/**
 * 查询栏目列表
 * @returns {Promise<Array>} 返回栏目列表
 */
export const getCategoryListAPI = () => api.get('/cms/category')

/**
 * 查询栏目详情
 * @param {string} id - 栏目ID
 * @returns {Promise<Object>} 返回栏目详情
 */
export const getCategoryDetailAPI = (id) => api.get(`/cms/category/${id}`)

/**
 * 创建栏目
 * @param {Object} data - 栏目信息
 * @returns {Promise<Object>} 返回创建的栏目信息
 */
export const createCategoryAPI = (data) => api.post('/cms/category', data)

/**
 * 更新栏目
 * @param {Object} data - 栏目信息
 * @returns {Promise<Object>} 返回更新后的栏目信息
 */
export const updateCategoryAPI = (data) => api.patch('/cms/category', data)

/**
 * 删除栏目
 * @param {string} id - 栏目ID
 * @returns {Promise<void>}
 */
export const deleteCategoryAPI = (id) => api.delete(`/cms/category/${id}`)

/**
 * 批量删除栏目
 * @param {string[]} ids - 栏目ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteCategoriesAPI = (ids) => api.delete('/cms/category', { data: { ids } })

// #endregion
