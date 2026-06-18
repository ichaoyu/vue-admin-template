import api from '@/utils/axios'

// #region 操作日志接口

/**
 * 查询操作日志列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回操作日志列表分页数据
 */
export const getOperLogListAPI = (params) => api.get('/monitor/oper-log', { params })

/**
 * 查询操作日志详情
 * @param {string} id - 日志ID
 * @returns {Promise<Object>} 返回操作日志详情
 */
export const getOperLogDetailAPI = (id) => api.get(`/monitor/oper-log/${id}`)

/**
 * 删除操作日志
 * @param {string} id - 日志ID
 * @returns {Promise<void>}
 */
export const deleteOperLogAPI = (id) => api.delete(`/monitor/oper-log/${id}`)

/**
 * 批量删除操作日志
 * @param {string[]} ids - 日志ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteOperLogsAPI = (ids) => api.delete('/monitor/oper-log', { data: { ids } })

/**
 * 清空操作日志
 * @returns {Promise<void>}
 */
export const clearOperLogAPI = () => api.delete('/monitor/oper-log')

// #endregion
