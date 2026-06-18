import api from '@/utils/axios'

// #region 菜单管理接口

/**
 * 获取菜单列表
 * @returns {Promise<Array>} 返回菜单列表
 */
export const getMenuListAPI = () => api.get('/system/menu')

/**
 * 创建菜单
 * @param {Object} data - 菜单信息
 * @returns {Promise<Object>} 返回创建的菜单信息
 */
export const createMenuAPI = (data) => api.post('/system/menu', data)

/**
 * 更新菜单
 * @param {string} id - 菜单ID
 * @param {Object} data - 菜单信息
 * @returns {Promise<Object>} 返回更新后的菜单信息
 */
export const updateMenuAPI = (id, data) => api.patch(`/system/menu/${id}`, data)

/**
 * 删除菜单
 * @param {string} id - 菜单ID
 * @returns {Promise<void>}
 */
export const deleteMenuAPI = (id) => api.delete(`/system/menu/${id}`)

/**
 * 获取菜单详情
 * @param {string} id - 菜单ID
 * @returns {Promise<Object>} 返回菜单详情
 */
export const getMenuDetailAPI = (id) => api.get(`/system/menu/${id}`)

/**
 * 获取菜单树
 * @returns {Promise<Array>} 返回菜单树
 */
export const getMenuTreeAPI = () => api.get('/system/menu/tree')

// #endregion
