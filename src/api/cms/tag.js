import api from '@/utils/axios'

// #region 标签管理接口

/**
 * 查询标签列表
 * @returns {Promise<Array>} 返回标签列表
 */
export const getTagListAPI = () => api.get('/cms/tag')

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
export const updateTagAPI = (data) => api.put('/cms/tag', data)

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
