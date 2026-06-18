import api from '@/utils/axios'

// #region 留言管理接口

/**
 * 查询留言列表
 * @returns {Promise<Array>} 返回留言列表
 */
export const getMessageListAPI = () => api.get('/cms/message')

/**
 * 查询留言详情
 * @param {string} id - 留言ID
 * @returns {Promise<Object>} 返回留言详情
 */
export const getMessageDetailAPI = (id) => api.get(`/cms/message/${id}`)

/**
 * 创建留言
 * @param {Object} data - 留言信息
 * @returns {Promise<Object>} 返回创建的留言信息
 */
export const createMessageAPI = (data) => api.post('/cms/message', data)

/**
 * 更新留言
 * @param {Object} data - 留言信息
 * @returns {Promise<Object>} 返回更新后的留言信息
 */
export const updateMessageAPI = (data) => api.put('/cms/message', data)

/**
 * 删除留言
 * @param {string} id - 留言ID
 * @returns {Promise<void>}
 */
export const deleteMessageAPI = (id) => api.delete(`/cms/message/${id}`)

/**
 * 批量删除留言
 * @param {string[]} ids - 留言ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteMessagesAPI = (ids) => api.delete('/cms/message', { data: { ids } })

// #endregion
