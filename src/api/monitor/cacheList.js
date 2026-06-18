import api from '@/utils/axios'

// #region 缓存管理接口

/**
 * 获取缓存分组列表
 * GET /monitor/cache/groups
 * @returns {Promise<{ list: Array<{ key: string, name: string, prefix: string, description: string, count: number }>, total: number }>}
 */
export const getCacheGroupsAPI = () => api.get('/monitor/cache/groups')

/**
 * 获取指定分组下的缓存键列表（支持分页和搜索）
 * GET /monitor/cache/groups/:groupKey
 * @param {string} groupKey - 分组标识（如 USER_MENUS、ONLINE_USER）
 * @param {{ page?: number, pageSize?: number, keyword?: string }} params - 查询参数
 * @returns {Promise<{ list: Array<{ key: string, cacheName: string, value: string, type: string, ttl: number, size: number, ttlFormatted: string, isExpired: boolean }>, total: number }>}
 */
export const getCacheKeysByGroupAPI = (groupKey, params) =>
  api.get(`/monitor/cache/groups/${encodeURIComponent(groupKey)}`, { params })

/**
 * 清空指定分组的缓存
 * DELETE /monitor/cache/groups/:groupKey
 * @param {string} groupKey - 分组标识
 * @returns {Promise<{ success: boolean, count: number }>}
 */
export const clearCacheByGroupAPI = (groupKey) => api.delete(`/monitor/cache/groups/${encodeURIComponent(groupKey)}`)

/**
 * 查询全部缓存列表（支持分页和搜索）
 * GET /monitor/cache
 * @param {{ page?: number, pageSize?: number, keyword?: string }} params - 查询参数
 * @returns {Promise<{ list: Array<{ key: string, cacheName: string, value: string, type: string, ttl: number, size: number, ttlFormatted: string, isExpired: boolean }>, total: number }>}
 */
export const getCacheListAPI = (params) => api.get('/monitor/cache', { params })

/**
 * 查询缓存详情
 * GET /monitor/cache/*
 * ⚠️ 重要：缓存键名包含特殊字符（如 {}、:），必须进行 URL 编码
 * @param {string} key - 完整的缓存键名（如 {BaseServerNest}:{redis}:user:menus:1）
 * @returns {Promise<{ key: string, cacheName: string, value: string, type: string, ttl: number, size: number, ttlFormatted: string, isExpired: boolean }>}
 */
export const getCacheDetailAPI = (key) => api.get(`/monitor/cache/${encodeURIComponent(key)}`)

/**
 * 删除单个缓存
 * DELETE /monitor/cache/*
 * ⚠️ 重要：缓存键名包含特殊字符，必须进行 URL 编码
 * @param {string} key - 完整的缓存键名
 * @returns {Promise<{ success: boolean }>}
 */
export const deleteCacheAPI = (key) => api.delete(`/monitor/cache/${encodeURIComponent(key)}`)

/**
 * 清空所有缓存
 * DELETE /monitor/cache
 * @returns {Promise<{ success: boolean, count: number }>}
 */
export const clearCacheAPI = () => api.delete('/monitor/cache')

/**
 * 获取 Redis 统计信息
 * GET /monitor/cache/stats/info
 * @returns {Promise<{ redisVersion: string, usedMemory: number, usedMemoryHuman: string, memoryUsagePercent: number, totalKeys: number, connectedClients: number, uptimeInSeconds: number, uptimeHuman: string, hits: number, misses: number, hitRate: number }>}
 */
export const getCacheStatsAPI = () => api.get('/monitor/cache/stats/info')

/**
 * 重置缓存命中率统计
 * POST /monitor/cache/stats/reset
 * @returns {Promise<{ success: boolean }>}
 */
export const resetCacheStatsAPI = () => api.post('/monitor/cache/stats/reset')

// #endregion
