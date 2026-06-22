import api from '@/utils/axios'

// #region 鉴权相关接口

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.userName - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.captchaId - 验证码ID
 * @param {string} data.captchaValue - 验证码值
 * @returns {Promise<string>} 返回token
 */
export const loginAPI = (data) => api.post('/auth/login', data)

/**
 * 用户退出登录
 * @returns {Promise<void>}
 */
export const logoutAPI = () => api.post('/auth/logout')

/**
 * 获取验证码
 * @returns {Promise<{id: string, imageBase64: string}>} 返回验证码ID和Base64图片
 */
export const getCaptchaAPI = () => api.get('/auth/captcha')

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} 返回用户信息
 */
export const getUserInfoAPI = () => api.get('/auth/getUserInfo')

/**
 * 获取当前用户配置
 * @returns {Promise<Object>} 返回用户配置
 */
export const getUserProfileAPI = () => api.get('/auth/getUserProfile')

/**
 * 更新用户基本信息
 * @param {Object} data - 用户基本信息
 * @returns {Promise<void>}
 */
export const updateUserBaseAPI = (data) => api.patch('/auth/updateUserBase', data)

/**
 * 更新用户密码
 * @param {Object} data - 密码信息
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise<void>}
 */
export const updateUserPasswordAPI = (data) => api.patch('/auth/updateUserPassword', data)

// #endregion

// #region 用户管理-认证操作

/**
 * 重置用户密码（仅超级管理员可用）
 * @param {string} userId - 用户 ID
 * @returns {Promise<void>}
 */
export const resetUserPasswordAPI = (userId) => api.patch('/auth/reset-password', { userId })

/**
 * 强制用户下线（仅超级管理员可用）
 * @param {string} userId - 用户 ID
 * @returns {Promise<void>}
 */
export const forceUserOfflineAPI = (userId) => api.post('/auth/force-offline', { userId })

// #endregion
