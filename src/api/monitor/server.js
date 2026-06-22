import api from '@/utils/axios'

// #region 服务监控接口

/**
 * 获取服务器信息
 * @returns {Promise<Object>} 返回服务器信息
 */
export const getServerInfoAPI = () => api.get('/monitor/server')

/**
 * 获取仪表盘统计数据
 * @returns {Promise<Object>} 返回统计数据
 */
export const getServerStatsAPI = () => api.get('/monitor/server/stats')

// #endregion
