import api from '@/utils/axios'

// #region 权限管理接口

/**
 * 查询权限列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @param {string} [params.permissionName] - 权限名称
 * @param {string} [params.permissionCode] - 权限编码
 * @param {string} [params.resourceId] - 资源 ID
 * @param {number} [params.actionType] - 操作类型（0 查看 1 新增 2 修改 3 删除 4 导出 5 导入 6 审核 7 其他）
 * @param {number} [params.status] - 状态（0 正常 1 停用）
 * @returns {Promise<Object>} 返回权限列表分页数据
 */
export const getPermissionListAPI = (params) => api.get('/system/permission', { params })

/**
 * 查询权限详情
 * @param {string} id - 权限 ID
 * @returns {Promise<Object>} 返回权限详情
 */
export const getPermissionDetailAPI = (id) => api.get(`/system/permission/${id}`)

/**
 * 创建权限
 * @param {Object} data - 权限信息
 * @param {string} data.permissionName - 权限名称
 * @param {string} data.permissionCode - 权限编码
 * @param {string} data.resourceId - 资源 ID
 * @param {number} data.actionType - 操作类型
 * @param {number} data.status - 状态
 * @param {string} [data.remark] - 备注
 * @returns {Promise<Object>} 返回创建的权限信息
 */
export const createPermissionAPI = (data) => api.post('/system/permission', data)

/**
 * 更新权限
 * @param {Object} data - 权限信息
 * @param {string} [data.permissionName] - 权限名称
 * @param {string} [data.permissionCode] - 权限编码
 * @param {string} [data.resourceId] - 资源 ID
 * @param {number} [data.actionType] - 操作类型
 * @param {number} [data.status] - 状态
 * @param {string} [data.remark] - 备注
 * @returns {Promise<Object>} 返回更新后的权限信息
 */
export const updatePermissionAPI = (data) => api.patch('/system/permission', data)

/**
 * 删除权限
 * @param {string} id - 权限 ID
 * @returns {Promise<void>}
 */
export const deletePermissionAPI = (id) => api.delete(`/system/permission/${id}`)

/**
 * 批量删除权限
 * @param {string[]} ids - 权限 ID 数组
 * @returns {Promise<void>}
 */
export const batchDeletePermissionsAPI = (ids) => api.delete('/system/permission', { data: { ids } })

/**
 * 验证权限
 * @param {Object} data - 验证参数
 * @param {string} data.permissionCode - 权限编码
 * @param {string} data.resourceId - 资源 ID
 * @param {number} data.actionType - 操作类型
 * @returns {Promise<Object>} 返回验证结果
 */
export const validatePermissionAPI = (data) => api.post('/system/permission/validate', data)

// #endregion
