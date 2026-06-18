import api from '@/utils/axios'

// #region 岗位管理接口

/**
 * 查询岗位列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回岗位列表数据
 */
export const getPostListAPI = (params) => api.get('/system/post', { params })

/**
 * 查询岗位详情
 * @param {string} id - 岗位ID
 * @returns {Promise<Object>} 返回岗位详情
 */
export const getPostDetailAPI = (id) => api.get(`/system/post/${id}`)

/**
 * 创建岗位
 * @param {Object} data - 岗位信息
 * @returns {Promise<Object>} 返回创建的岗位信息
 */
export const createPostAPI = (data) => api.post('/system/post', data)

/**
 * 更新岗位
 * @param {string} id - 岗位ID
 * @param {Object} data - 岗位信息
 * @returns {Promise<Object>} 返回更新后的岗位信息
 */
export const updatePostAPI = (id, data) => api.patch(`/system/post/${id}`, data)

/**
 * 删除岗位（单个）
 * @param {string} id - 岗位ID
 * @returns {Promise<void>}
 */
export const deletePostAPI = (id) => api.delete(`/system/post/${id}`)

/**
 * 批量删除岗位
 * @param {string[]} ids - 岗位ID数组
 * @returns {Promise<void>}
 */
export const batchDeletePostsAPI = (ids) => api.delete('/system/post', { data: { ids } })

// #endregion
