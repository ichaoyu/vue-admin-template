import api from '@/utils/axios'

// #region 健康检查接口

/**
 * 完整健康检查
 * @returns {Promise<Object>} 返回系统健康状态
 */
export const getHealthAPI = () => api.get('/health')

/**
 * 就绪检查（DB+Redis）
 * @returns {Promise<Object>} 返回就绪状态
 */
export const getHealthReadyAPI = () => api.get('/health/ready')

/**
 * 存活检查
 * @returns {Promise<Object>} 返回存活状态
 */
export const getHealthLiveAPI = () => api.get('/health/live')

// #endregion
