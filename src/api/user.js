import api from '@/utils/axios'

// #region 用户管理接口

/**
 * 查询用户列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回用户列表分页数据
 */
export const getUserListAPI = (params) => api.get('/system/user', { params })

/**
 * 创建用户
 * @param {Object} data - 用户信息
 * @returns {Promise<Object>} 返回创建的用户信息
 */
export const createUserAPI = (data) => api.post('/system/user', data)

/**
 * 查询用户详情
 * @param {string} id - 用户ID
 * @returns {Promise<Object>} 返回用户详情
 */
export const getUserDetailAPI = (id) => api.get(`/system/user/${id}`)

/**
 * 更新用户
 * @param {Object} data - 用户信息
 * @returns {Promise<Object>} 返回更新后的用户信息
 */
export const updateUserAPI = (data) => api.patch('/system/user', data)

/**
 * 删除用户
 * @param {string} id - 用户ID
 * @returns {Promise<void>}
 */
export const deleteUserAPI = (id) => api.delete(`/system/user/${id}`)

/**
 * 批量删除用户
 * @param {string[]} ids - 用户ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteUsersAPI = (ids) => api.delete('/system/user', { data: { ids } })

/**
 * 重置用户密码（仅超级管理员可用）
 * @param {Object} data - 重置密码参数
 * @returns {Promise<void>}
 */
export const resetUserPasswordAPI = (data) => api.patch('/system/user/reset-password', data)

/**
 * 强制用户下线（仅超级管理员可用）
 * @param {string} userId - 用户 ID
 * @returns {Promise<void>}
 */
export const forceUserOfflineAPI = (userId) => api.post('/auth/force-offline', { userId })

// #endregion
