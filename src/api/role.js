import api from '@/utils/axios'

// #region 角色管理接口

/**
 * 查询角色列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回角色列表
 */
export const getRoleListAPI = (params) => api.get('/system/role', { params })

/**
 * 创建角色
 * @param {Object} data - 角色信息
 * @returns {Promise<Object>} 返回创建的角色信息
 */
export const createRoleAPI = (data) => api.post('/system/role', data)

/**
 * 查询角色详情
 * @param {string} id - 角色ID
 * @returns {Promise<Object>} 返回角色详情
 */
export const getRoleDetailAPI = (id) => api.get(`/system/role/${id}`)

/**
 * 更新角色
 * @param {string} id - 角色 ID
 * @param {Object} data - 角色信息（包含 menuIds）
 * @returns {Promise<Object>} 返回更新后的角色信息
 */
export const updateRoleAPI = (id, data) => api.patch(`/system/role/${id}`, data)

/**
 * 删除角色
 * @param {string} id - 角色 ID
 * @returns {Promise<void>}
 */
export const deleteRoleAPI = (id) => api.delete(`/system/role/${id}`)

/**
 * 批量删除角色
 * @param {string[]} ids - 角色ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteRolesAPI = (ids) => api.delete('/system/role', { data: { ids } })

// #endregion
