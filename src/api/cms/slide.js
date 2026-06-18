import api from '@/utils/axios'

// #region 轮播图管理接口

/**
 * 查询轮播图列表
 * @returns {Promise<Array>} 返回轮播图列表
 */
export const getSlideListAPI = () => api.get('/cms/slide')

/**
 * 查询轮播图详情
 * @param {string} id - 轮播图ID
 * @returns {Promise<Object>} 返回轮播图详情
 */
export const getSlideDetailAPI = (id) => api.get(`/cms/slide/${id}`)

/**
 * 创建轮播图
 * @param {Object} data - 轮播图信息
 * @returns {Promise<Object>} 返回创建的轮播图信息
 */
export const createSlideAPI = (data) => api.post('/cms/slide', data)

/**
 * 更新轮播图
 * @param {Object} data - 轮播图信息
 * @returns {Promise<Object>} 返回更新后的轮播图信息
 */
export const updateSlideAPI = (data) => api.put('/cms/slide', data)

/**
 * 删除轮播图
 * @param {string} id - 轮播图ID
 * @returns {Promise<void>}
 */
export const deleteSlideAPI = (id) => api.delete(`/cms/slide/${id}`)

/**
 * 批量删除轮播图
 * @param {string[]} ids - 轮播图ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteSlidesAPI = (ids) => api.delete('/cms/slide', { data: { ids } })

// #endregion
