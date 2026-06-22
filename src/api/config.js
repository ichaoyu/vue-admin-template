import api from '@/utils/axios'

// #region 参数管理接口

/**
 * 查询参数列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回参数列表
 */
export const getConfigListAPI = (params) => api.get('/system/config', { params })

/**
 * 创建参数
 * @param {Object} data - 参数信息
 * @returns {Promise<Object>} 返回创建的参数信息
 */
export const createConfigAPI = (data) => api.post('/system/config', data)

/**
 * 查询参数详情
 * @param {string} id - 参数ID
 * @returns {Promise<Object>} 返回参数详情
 */
export const getConfigDetailAPI = (id) => api.get(`/system/config/${id}`)

/**
 * 更新参数
 * @param {Object} data - 参数信息
 * @returns {Promise<Object>} 返回更新后的参数信息
 */
export const updateConfigAPI = (data) => api.patch('/system/config', data)

/**
 * 删除参数
 * @param {string} id - 参数ID
 * @returns {Promise<void>}
 */
export const deleteConfigAPI = (id) => api.delete(`/system/config/${id}`)

/**
 * 批量删除参数
 * @param {string[]} ids - 参数ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteConfigsAPI = (ids) => api.delete('/system/config', { data: { ids } })

/**
 * 根据参数键名获取参数值
 * @param {string} configKey - 参数键名
 * @returns {Promise<string>} 返回参数值
 */
export const getConfigByKeyAPI = (configKey) => api.get(`/system/config/key/${configKey}`)

// #endregion
