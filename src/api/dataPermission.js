import api from '@/utils/axios'

// #region 数据权限接口

/**
 * 查询数据权限规则列表
 * @param {Object} [params] - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @param {string} [params.ruleName] - 规则名称
 * @param {string} [params.resourceType] - 资源类型
 * @param {number} [params.status] - 状态（0 正常 1 停用）
 * @returns {Promise<Object>} 返回数据权限规则列表分页数据
 */
export const getDataPermissionListAPI = (params) => api.get('/system/data-permission', { params })

/**
 * 查询数据权限规则详情
 * @param {string} id - 规则 ID
 * @returns {Promise<Object>} 返回数据权限规则详情
 */
export const getDataPermissionDetailAPI = (id) => api.get(`/system/data-permission/${id}`)

/**
 * 创建数据权限规则
 * @param {Object} data - 规则信息
 * @param {string} data.ruleName - 规则名称
 * @param {string} data.resourceType - 资源类型
 * @param {string} data.scopeType - 范围类型（0 全部 1 自定义 2 本部门 3 本部门及以下 4 仅本人）
 * @param {string[]} [data.deptIds] - 部门 ID 数组（当 scopeType 为 1 时必填）
 * @param {number} data.status - 状态
 * @param {string} [data.remark] - 备注
 * @returns {Promise<Object>} 返回创建的规则信息
 */
export const createDataPermissionAPI = (data) => api.post('/system/data-permission', data)

/**
 * 更新数据权限规则
 * @param {string} id - 规则 ID
 * @param {Object} data - 规则信息
 * @param {string} [data.ruleName] - 规则名称
 * @param {string} [data.resourceType] - 资源类型
 * @param {string} [data.scopeType] - 范围类型
 * @param {string[]} [data.deptIds] - 部门 ID 数组
 * @param {number} [data.status] - 状态
 * @param {string} [data.remark] - 备注
 * @returns {Promise<Object>} 返回更新后的规则信息
 */
export const updateDataPermissionAPI = (id, data) => api.put(`/system/data-permission/${id}`, data)

/**
 * 删除数据权限规则
 * @param {string} id - 规则 ID
 * @returns {Promise<void>}
 */
export const deleteDataPermissionAPI = (id) => api.delete(`/system/data-permission/${id}`)

/**
 * 批量删除数据权限规则
 * @param {string[]} ids - 规则 ID 数组
 * @returns {Promise<void>}
 */
export const batchDeleteDataPermissionsAPI = (ids) => api.delete('/system/data-permission', { data: { ids } })

/**
 * 生成数据权限过滤条件
 * @param {Object} data - 生成参数
 * @param {string} data.resourceType - 资源类型
 * @param {string} data.userId - 用户 ID
 * @returns {Promise<Object>} 返回过滤条件
 */
export const generateDataPermissionFilterAPI = (data) => api.post('/system/data-permission/generate-filter', data)

/**
 * 验证数据所有权
 * @param {Object} data - 验证参数
 * @param {string} data.resourceType - 资源类型
 * @param {string} data.resourceId - 资源 ID
 * @param {string} data.userId - 用户 ID
 * @returns {Promise<Object>} 返回验证结果
 */
export const validateDataOwnershipAPI = (data) => api.post('/system/data-permission/validate-ownership', data)

// #endregion
