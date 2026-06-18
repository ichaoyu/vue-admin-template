import api from '@/utils/axios'

// #region 友情链接管理接口

/**
 * 查询友情链接列表
 * @returns {Promise<Array>} 返回友情链接列表
 */
export const getFriendlinkListAPI = () => api.get('/cms/friendlink')

/**
 * 查询友情链接详情
 * @param {string} id - 友情链接ID
 * @returns {Promise<Object>} 返回友情链接详情
 */
export const getFriendlinkDetailAPI = (id) => api.get(`/cms/friendlink/${id}`)

/**
 * 创建友情链接
 * @param {Object} data - 友情链接信息
 * @returns {Promise<Object>} 返回创建的友情链接信息
 */
export const createFriendlinkAPI = (data) => api.post('/cms/friendlink', data)

/**
 * 更新友情链接
 * @param {Object} data - 友情链接信息
 * @returns {Promise<Object>} 返回更新后的友情链接信息
 */
export const updateFriendlinkAPI = (data) => api.patch('/cms/friendlink', data)

/**
 * 删除友情链接
 * @param {string} id - 友情链接ID
 * @returns {Promise<void>}
 */
export const deleteFriendlinkAPI = (id) => api.delete(`/cms/friendlink/${id}`)

/**
 * 批量删除友情链接
 * @param {string[]} ids - 友情链接ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteFriendlinksAPI = (ids) => api.delete('/cms/friendlink', { data: { ids } })

// #endregion
