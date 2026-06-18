import api from '@/utils/axios'

// #region 站点设置接口

/**
 * 查询站点信息列表
 * @returns {Promise<Array>} 返回站点信息列表
 */
export const getSiteListAPI = () => api.get('/cms/site')

/**
 * 查询站点信息详情
 * @param {string} id - 站点ID
 * @returns {Promise<Object>} 返回站点信息详情
 */
export const getSiteDetailAPI = (id) => api.get(`/cms/site/${id}`)

/**
 * 创建站点信息
 * @param {Object} data - 站点信息
 * @returns {Promise<Object>} 返回创建的站点信息
 */
export const createSiteAPI = (data) => api.post('/cms/site', data)

/**
 * 更新站点信息
 * @param {Object} data - 站点信息
 * @returns {Promise<Object>} 返回更新后的站点信息
 */
export const updateSiteAPI = (data) => api.patch('/cms/site', data)

/**
 * 删除站点信息
 * @param {string} id - 站点ID
 * @returns {Promise<void>}
 */
export const deleteSiteAPI = (id) => api.delete(`/cms/site/${id}`)

/**
 * 批量删除站点信息
 * @param {string[]} ids - 站点ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteSitesAPI = (ids) => api.delete('/cms/site', { data: { ids } })

// #endregion
