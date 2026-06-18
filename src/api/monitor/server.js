import api from '@/utils/axios'

// #region 服务监控接口

/**
 * 获取服务器信息
 * @returns {Promise<Object>} 返回服务器信息
 */
export const getServerInfoAPI = () => api.get('/monitor/server')

// #endregion
