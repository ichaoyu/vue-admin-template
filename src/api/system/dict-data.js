import api from '@/utils/axios'

// #region 字典数据接口

/**
 * 查询字典数据列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回字典数据列表
 */
export const getDictDataListAPI = (params) => api.get('/system/dict/data', { params })

/**
 * 创建字典数据
 * @param {Object} data - 字典数据信息
 * @returns {Promise<Object>} 返回创建的字典数据信息
 */
export const createDictDataAPI = (data) => api.post('/system/dict/data', data)

/**
 * 查询字典数据详情
 * @param {string} id - 字典数据ID
 * @returns {Promise<Object>} 返回字典数据详情
 */
export const getDictDataDetailAPI = (id) => api.get(`/system/dict/data/${id}`)

/**
 * 更新字典数据
 * @param {Object} data - 字典数据信息
 * @returns {Promise<Object>} 返回更新后的字典数据信息
 */
export const updateDictDataAPI = (data) => api.patch('/system/dict/data', data)

/**
 * 删除字典数据
 * @param {string} id - 字典数据ID
 * @returns {Promise<void>}
 */
export const deleteDictDataAPI = (id) => api.delete(`/system/dict/data/${id}`)

/**
 * 批量删除字典数据
 * @param {string[]} ids - 字典数据ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteDictDataAPI = (ids) => api.delete('/system/dict/data', { data: { ids } })

/**
 * 根据字典类型获取字典数据
 * @param {string} dictType - 字典类型
 * @returns {Promise<Array>} 返回字典数据列表
 */
export const getDictDataByTypeAPI = (dictType) => api.get(`/system/dict/data/type/${dictType}`)

// #endregion
