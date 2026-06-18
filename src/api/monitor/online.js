import api from '@/utils/axios'

// #region 在线用户接口

/**
 * 查询在线用户列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回在线用户列表分页数据
 */
export const getOnlineUserListAPI = (params) => api.get('/monitor/online', { params })

/**
 * 强制下线用户
 * @param {string} tokenId - 会话ID
 * @returns {Promise<void>}
 */
export const forceLogoutAPI = (tokenId) => api.delete(`/monitor/online/${tokenId}`)

// #endregion
