import api from '@/utils/axios'

// #region 标签管理接口

/**
 * 查询标签列表（分页）
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回标签分页数据
 */
export const getTagListAPI = (params) => api.get('/cms/tag', { params })

/**
 * 查询全部标签（不分页，用于下拉选择）
 * @returns {Promise<Array>} 返回标签列表
 */
export const getAllTagsAPI = () => api.get('/cms/tag/all')

/**
 * 查询标签详情
 * @param {string} id - 标签ID
 * @returns {Promise<Object>} 返回标签详情
 */
export const getTagDetailAPI = (id) => api.get(`/cms/tag/${id}`)

/**
 * 创建标签
 * @param {Object} data - 标签信息
 * @returns {Promise<Object>} 返回创建的标签信息
 */
export const createTagAPI = (data) => api.post('/cms/tag', data)

/**
 * 更新标签
 * @param {Object} data - 标签信息
 * @returns {Promise<Object>} 返回更新后的标签信息
 */
export const updateTagAPI = (data) => api.patch('/cms/tag', data)

/**
 * 删除标签
 * @param {string} id - 标签ID
 * @returns {Promise<void>}
 */
export const deleteTagAPI = (id) => api.delete(`/cms/tag/${id}`)

/**
 * 批量删除标签
 * @param {string[]} ids - 标签ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteTagsAPI = (ids) => api.delete('/cms/tag', { data: { ids } })

// #endregion
