import api from '@/utils/axios'

// #region 登录日志接口

/**
 * 查询登录日志列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回登录日志列表分页数据
 */
export const getLoginLogListAPI = (params) => api.get('/monitor/login-log', { params })

/**
 * 查询登录日志详情
 * @param {string} id - 日志ID
 * @returns {Promise<Object>} 返回登录日志详情
 */
export const getLoginLogDetailAPI = (id) => api.get(`/monitor/login-log/${id}`)

/**
 * 删除登录日志
 * @param {string} id - 日志ID
 * @returns {Promise<void>}
 */
export const deleteLoginLogAPI = (id) => api.delete(`/monitor/login-log/${id}`)

/**
 * 批量删除登录日志
 * @param {string[]} ids - 日志ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteLoginLogsAPI = (ids) => api.delete('/monitor/login-log', { data: { ids } })

/**
 * 清空登录日志
 * @returns {Promise<void>}
 */
export const clearLoginLogAPI = () => api.delete('/monitor/login-log')

// #endregion
