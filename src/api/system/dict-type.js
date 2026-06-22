import api from '@/utils/axios'

// #region 字典类型接口

/**
 * 查询字典类型列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回字典类型列表
 */
export const getDictTypeListAPI = (params) => api.get('/system/dict/type', { params })

/**
 * 创建字典类型
 * @param {Object} data - 字典类型信息
 * @returns {Promise<Object>} 返回创建的字典类型信息
 */
export const createDictTypeAPI = (data) => api.post('/system/dict/type', data)

/**
 * 查询字典类型详情
 * @param {string} id - 字典类型ID
 * @returns {Promise<Object>} 返回字典类型详情
 */
export const getDictTypeDetailAPI = (id) => api.get(`/system/dict/type/${id}`)

/**
 * 更新字典类型
 * @param {Object} data - 字典类型信息
 * @returns {Promise<Object>} 返回更新后的字典类型信息
 */
export const updateDictTypeAPI = (data) => api.patch('/system/dict/type', data)

/**
 * 删除字典类型
 * @param {string} id - 字典类型ID
 * @returns {Promise<void>}
 */
export const deleteDictTypeAPI = (id) => api.delete(`/system/dict/type/${id}`)

/**
 * 批量删除字典类型
 * @param {string[]} ids - 字典类型ID数组
 * @returns {Promise<void>}
 */
export const batchDeleteDictTypesAPI = (ids) => api.delete('/system/dict/type', { data: { ids } })

// #endregion
