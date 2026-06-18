import api from '@/utils/axios'

// #region 通知管理接口

/**
 * 发送通知
 * @param {Object} data - 通知信息
 * @param {string} data.title - 标题
 * @param {string} data.content - 内容
 * @param {string} data.type - 类型
 * @param {string} data.targetType - 目标类型: user/role/all
 * @param {string} data.targetIds - 目标ID列表(JSON数组)
 * @returns {Promise<Object>} 返回发送结果
 */
export const sendNotificationAPI = (data) => api.post('/notification', data)

/**
 * 查询通知列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {number} params.isRead - 已读状态：0未读 1已读
 * @returns {Promise<Object>} 返回通知列表 { list, total, page, pageSize }
 */
export const getNotificationListAPI = (params) => api.get('/notification/list', { params })

/**
 * 标记已读
 * @param {Object} data - 包含通知 ID 的参数
 * @returns {Promise<Object>} 返回操作结果
 */
export const markAsReadAPI = (data) => api.patch('/notification/read', data)

/**
 * 全部标记已读
 * @returns {Promise<Object>} 返回操作结果
 */
export const markAllAsReadAPI = () => api.patch('/notification/read-all')

/**
 * 未读数量
 * @returns {Promise<number>} 返回未读数量
 */
export const getUnreadCountAPI = () => api.get('/notification/unread-count')

/**
 * 批量删除通知
 * @param {string[]} ids - 通知ID数组
 * @returns {Promise<Object>} 返回删除结果 { success, affected }
 */
export const batchDeleteNotificationsAPI = (ids) => api.delete('/notification/batch', { data: { ids } })

// #endregion
