import api from '@/utils/axios'

// #region 动态权限接口

/**
 * 查询动态权限规则列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page] - 页码
 * @param {number} [params.pageSize] - 每页条数
 * @param {string} [params.ruleName] - 规则名称
 * @param {string} [params.resourceCode] - 资源编码
 * @param {number} [params.resourceType] - 资源类型（0 菜单 1 按钮 2 API 3 数据）
 * @param {number} [params.status] - 状态（0 正常 1 停用）
 * @returns {Promise<Object>} 返回动态权限规则列表分页数据
 */
export const getDynamicPermissionListAPI = (params) => api.get('/system/dynamic-permission', { params })

/**
 * 查询动态权限规则详情
 * @param {string} id - 规则 ID
 * @returns {Promise<Object>} 返回动态权限规则详情
 */
export const getDynamicPermissionDetailAPI = (id) => api.get(`/system/dynamic-permission/${id}`)

/**
 * 创建动态权限规则
 * @param {Object} data - 规则信息
 * @param {string} data.ruleName - 规则名称
 * @param {string} data.resourceCode - 资源编码
 * @param {number} data.resourceType - 资源类型（0 菜单 1 按钮 2 API 3 数据）
 * @param {number} data.permissionType - 权限类型（0 部门级 1 角色级 2 用户级 3 数据级）
 * @param {string} data.ruleCondition - 规则条件（JSON 格式）
 * @param {number} data.ruleAction - 规则动作（0 允许 1 拒绝）
 * @param {number} data.priority - 优先级
 * @param {string} [data.startTime] - 开始时间
 * @param {string} [data.endTime] - 结束时间
 * @param {number} data.status - 状态（0 正常 1 停用）
 * @param {string} data.description - 描述
 * @returns {Promise<Object>} 返回创建的规则信息
 */
export const createDynamicPermissionAPI = (data) => api.post('/system/dynamic-permission', data)

/**
 * 更新动态权限规则
 * @param {string} id - 规则 ID
 * @param {Object} data - 规则信息
 * @param {string} [data.ruleName] - 规则名称
 * @param {string} [data.resourceCode] - 资源编码
 * @param {number} [data.resourceType] - 资源类型（0 菜单 1 按钮 2 API 3 数据）
 * @param {number} [data.permissionType] - 权限类型（0 部门级 1 角色级 2 用户级 3 数据级）
 * @param {string} [data.ruleCondition] - 规则条件（JSON 格式）
 * @param {number} [data.ruleAction] - 规则动作（0 允许 1 拒绝）
 * @param {number} [data.priority] - 优先级
 * @param {string} [data.startTime] - 开始时间
 * @param {string} [data.endTime] - 结束时间
 * @param {number} [data.status] - 状态（0 正常 1 停用）
 * @param {string} [data.description] - 描述
 * @returns {Promise<Object>} 返回更新后的规则信息
 */
export const updateDynamicPermissionAPI = (id, data) => api.patch(`/system/dynamic-permission/${id}`, data)

/**
 * 删除动态权限规则
 * @param {string} id - 规则 ID
 * @returns {Promise<void>}
 */
export const deleteDynamicPermissionAPI = (id) => api.delete(`/system/dynamic-permission/${id}`)

/**
 * 批量删除动态权限规则
 * @param {string[]} ids - 规则 ID 数组
 * @returns {Promise<void>}
 */
export const batchDeleteDynamicPermissionAPI = (ids) => api.delete('/system/dynamic-permission', { data: { ids } })

/**
 * 启用动态权限规则
 * @param {string} id - 规则 ID
 * @returns {Promise<void>}
 */
export const enableDynamicPermissionAPI = (id) => api.patch(`/system/dynamic-permission/${id}/enable`)

/**
 * 停用动态权限规则
 * @param {string} id - 规则 ID
 * @returns {Promise<void>}
 */
export const disableDynamicPermissionAPI = (id) => api.patch(`/system/dynamic-permission/${id}/disable`)

/**
 * 验证动态权限
 * @param {Object} data - 验证参数
 * @param {string} data.resourceCode - 资源编码
 * @param {number} data.resourceType - 资源类型
 * @param {string} [data.expression] - 规则表达式
 * @returns {Promise<Object>} 返回验证结果
 */
export const validateDynamicPermissionAPI = (data) => api.post('/system/dynamic-permission/validate', data)

// #endregion
