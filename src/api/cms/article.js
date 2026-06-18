import api from '@/utils/axios'

// #region 文章管理接口

/**
 * 查询文章列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回文章列表分页数据
 */
export const getArticleListAPI = (params) => api.get('/cms/article', { params })

/**
 * 查询文章详情
 * @param {string} id - 文章ID
 * @returns {Promise<Object>} 返回文章详情
 */
export const getArticleDetailAPI = (id) => api.get(`/cms/article/${id}`)

/**
 * 创建文章
 * @param {Object} data - 文章信息
 * @returns {Promise<Object>} 返回创建的文章信息
 */
export const createArticleAPI = (data) => api.post('/cms/article', data)

/**
 * 更新文章
 * @param {Object} data - 文章信息
 * @returns {Promise<Object>} 返回更新后的文章信息
 */
export const updateArticleAPI = (data) => api.put('/cms/article', data)

/**
 * 删除文章
 * @param {string} id - 文章ID
 * @returns {Promise<void>}
 */
export const deleteArticleAPI = (id) => api.delete(`/cms/article/${id}`)

/**
 * 批量删除文章
 * @param {string[]} ids - 文章ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteArticlesAPI = (ids) => api.delete('/cms/article', { data: { ids } })

// #endregion
