import api from '@/utils/axios'

// #region 部门管理接口

/**
 * 查询部门列表（分页）
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} 返回部门列表分页数据
 */
export const getDeptListAPI = (params) => api.get('/system/dept', { params })

/**
 * 查询部门树结构
 * @returns {Promise<Array>} 返回部门树形数据
 */
export const getDeptTreeAPI = () => api.get('/system/dept/tree')

/**
 * 查询部门详情
 * @param {string} id - 部门ID
 * @returns {Promise<Object>} 返回部门详情
 */
export const getDeptDetailAPI = (id) => api.get(`/system/dept/${id}`)

/**
 * 创建部门
 * @param {Object} data - 部门信息
 * @returns {Promise<Object>} 返回创建的部门信息
 */
export const createDeptAPI = (data) => api.post('/system/dept', data)

/**
 * 更新部门
 * @param {string} id - 部门ID
 * @param {Object} data - 部门信息
 * @returns {Promise<Object>} 返回更新后的部门信息
 */
export const updateDeptAPI = (id, data) => api.patch(`/system/dept/${id}`, data)

/**
 * 删除部门
 * @param {string} id - 部门ID
 * @returns {Promise<void>}
 */
export const deleteDeptAPI = (id) => api.delete(`/system/dept/${id}`)

// #endregion
