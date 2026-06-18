<template>
  <div class="cache-list-container">
    <!-- #region 顶部：Redis统计信息 -->
    <div class="stats-bar" v-loading="statsLoading">
      <div class="stat-item">
        <span class="stat-label">Redis版本</span>
        <span class="stat-value">{{ cacheStats.redisVersion || '-' }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">运行时间</span>
        <span class="stat-value">{{ cacheStats.uptimeHuman || '-' }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">已用内存</span>
        <el-tag :type="cacheStats.memoryUsagePercent > 80 ? 'danger' : 'info'" size="small">
          {{ cacheStats.usedMemoryHuman || '-' }}
          ({{ cacheStats.memoryUsagePercent != null ? cacheStats.memoryUsagePercent + '%' : '-' }})
        </el-tag>
      </div>
      <div class="stat-item">
        <span class="stat-label">Key总数</span>
        <span class="stat-value">{{ cacheStats.totalKeys ?? '-' }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">连接数</span>
        <span class="stat-value">{{ cacheStats.connectedClients ?? '-' }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">命中率</span>
        <el-tag :type="getHitRateType(cacheStats.hitRate)" size="small">
          {{ cacheStats.hitRate != null ? cacheStats.hitRate.toFixed(1) + '%' : '-' }}
        </el-tag>
        <el-tooltip v-if="cacheStats.hits != null || cacheStats.misses != null" placement="top">
          <template #content>
            命中: {{ cacheStats.hits ?? 0 }} 次<br />
            未命中: {{ cacheStats.misses ?? 0 }} 次
          </template>
          <el-icon class="info-icon"><InfoFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="stat-actions">
        <el-button :icon="Refresh" size="small" @click="loadStats">
          <span class="btn-text">刷新</span>
        </el-button>
        <el-button :icon="Delete" size="small" type="danger" @click="handleClearAllCache">
          <span class="btn-text">清空缓存</span>
        </el-button>
        <el-button :icon="RefreshLeft" size="small" type="warning" @click="handleResetStats">
          <span class="btn-text">重置统计</span>
        </el-button>
      </div>
    </div>
    <!-- #endregion -->

    <!-- #region 主体：三栏布局 -->
    <div class="cache-main" v-loading="loading">
      <!-- 左侧：缓存分组列表 -->
      <div class="cache-panel cache-name-panel">
        <div class="panel-header">
          <span class="panel-title">缓存分组</span>
          <el-button :icon="Refresh" circle size="small" @click="handleRefreshGroups" />
        </div>
        <div class="panel-body">
          <el-table :data="cacheGroups" highlight-current-row size="small" @row-click="handleGroupClick">
            <el-table-column type="index" label="#" width="36" align="center" />
            <el-table-column prop="name" label="名称" min-width="90">
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="数量" width="50" align="center">
              <template #default="{ row }">
                <el-tag size="small">{{ row.count }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="" width="36" align="center">
              <template #default="{ row }">
                <el-button type="danger" size="small" link :icon="Delete" @click.stop="handleClearGroup(row)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 中间：缓存键名列表（带分页和搜索） -->
      <div class="cache-panel cache-key-panel">
        <div class="panel-header">
          <span class="panel-title">键名列表</span>
          <el-button :icon="Refresh" circle size="small" @click="handleRefreshKeys" />
        </div>
        <div class="panel-body">
          <!-- 搜索框 -->
          <div class="search-box">
            <el-input
              v-model="keyword"
              placeholder="搜索缓存键..."
              clearable
              size="small"
              :prefix-icon="Search"
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            />
          </div>
          <!-- 键列表格 -->
          <el-table :data="currentGroupKeys" highlight-current-row size="small" @row-click="handleKeyClick">
            <el-table-column type="index" label="#" width="40" align="center" />
            <el-table-column prop="cacheName" label="缓存键名" min-width="140" show-overflow-tooltip />
            <el-table-column label="" width="40" align="center">
              <template #default="{ row }">
                <el-button type="danger" size="small" link :icon="Delete" @click.stop="handleDeleteKey(row)" />
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="pagination-box">
            <el-pagination
              v-model:current-page="pagination.page"
              :page-size="pagination.pageSize"
              :total="keyListTotal"
              layout="total, prev, pager, next"
              small
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>

      <!-- 右侧：缓存内容详情 -->
      <div class="cache-panel cache-detail-panel">
        <div class="panel-header">
          <span class="panel-title">缓存内容</span>
          <el-button type="primary" size="small" :icon="Delete" @click="handleClearAll">清理全部</el-button>
        </div>
        <div class="detail-body">
          <template v-if="detailData.key">
            <el-descriptions :column="1" border size="small" class="detail-desc">
              <el-descriptions-item label="缓存名称">
                {{ detailData.cacheName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="缓存键名">
                <el-text size="small" truncated :title="detailData.key">{{ detailData.key }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="数据类型">
                {{ detailData.type || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="过期时间">
                <el-tag v-if="detailData.isExpired" type="danger" size="small">已过期</el-tag>
                <el-tag v-else-if="detailData.ttl === -1" type="success" size="small">永不过期</el-tag>
                <span v-else>{{ detailData.ttlFormatted || formatTTL(detailData.ttl) }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="缓存大小">
                {{ formatSize(detailData.size) || '-' }}
              </el-descriptions-item>
            </el-descriptions>
            <!-- 缓存值内容 -->
            <div class="value-section">
              <div class="value-header">
                <div class="value-label">缓存内容:</div>
                <el-button size="small" type="primary" link @click="handleCopyValue">复制内容</el-button>
              </div>
              <pre class="value-content"><code>{{ formatCacheValue(detailData.value, detailData.type) }}</code></pre>
            </div>
          </template>
          <el-empty v-else description="请选择左侧缓存查看内容" :image-size="100" />
        </div>
      </div>
    </div>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Refresh, Search, InfoFilled, RefreshLeft } from '@element-plus/icons-vue'
import {
  getCacheGroupsAPI,
  getCacheKeysByGroupAPI,
  clearCacheByGroupAPI,
  getCacheDetailAPI,
  deleteCacheAPI,
  clearCacheAPI,
  getCacheStatsAPI,
  resetCacheStatsAPI,
} from '@/api/monitor/cacheList'

defineOptions({
  name: 'MonitorCacheListIndex',
})

// #region 数据定义

const loading = ref(false)
const statsLoading = ref(false)
const keyword = ref('')

// Redis统计信息
const cacheStats = ref({})

// 分组数据
const cacheGroups = ref([])

// 当前选中分组
const currentGroup = ref(null)

// 键列表数据
const currentGroupKeys = ref([])
const keyListTotal = ref(0)

// 分页参数
const pagination = reactive({
  page: 1,
  pageSize: 20,
})

// 详情数据
const detailData = ref({})

// #endregion

// #region 工具方法

const formatSize = (bytes) => {
  if ((bytes !== 0 && !bytes) || bytes === undefined) return '-'
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

const getHitRateType = (hitRate) => {
  if (hitRate == null) return 'info'
  if (hitRate >= 80) return 'success'
  if (hitRate >= 50) return 'warning'
  return 'danger'
}

const formatTTL = (ttl) => {
  if (ttl === undefined || ttl === null) return '-'
  if (ttl >= 86400) {
    const days = Math.floor(ttl / 86400)
    return `${days}天${Math.floor((ttl % 86400) / 3600)}小时`
  }
  if (ttl >= 3600) {
    const hours = Math.floor(ttl / 3600)
    return `${hours}小时${Math.floor((ttl % 3600) / 60)}分钟`
  }
  if (ttl >= 60) return `${Math.floor(ttl / 60)}分钟${ttl % 60}秒`
  return `${ttl}秒`
}

/**
 * 格式化缓存值，支持JSON格式化显示
 */
const formatCacheValue = (value, type) => {
  if (!value) return '无内容'

  // 特殊状态直接返回
  if (['加载中...', '无内容', '获取缓存内容失败'].includes(value)) {
    return value
  }

  // 对于hash、list、set、zset类型，尝试解析为JSON
  if (['hash', 'list', 'set', 'zset'].includes(type)) {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }

  // 对于string类型，尝试解析为JSON
  if (type === 'string') {
    try {
      // 检查是否是JSON格式
      if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
        return JSON.stringify(JSON.parse(value), null, 2)
      }
    } catch {
      // 不是JSON，直接返回
    }
  }

  return value
}

/**
 * 复制缓存内容到剪贴板
 */
const handleCopyValue = () => {
  if (detailData.value.value) {
    navigator.clipboard
      .writeText(detailData.value.value)
      .then(() => {
        ElMessage.success('复制成功')
      })
      .catch(() => {
        ElMessage.error('复制失败')
      })
  }
}

// #endregion

// #region 统计信息

/**
 * 加载Redis统计信息
 */
const loadStats = async () => {
  statsLoading.value = true
  try {
    const res = await getCacheStatsAPI()
    cacheStats.value = res?.data || res || {}
  } catch (error) {
    cacheStats.value = {}
  } finally {
    statsLoading.value = false
  }
}

// #endregion

// #region 第一步：获取缓存分组

const loadGroups = async () => {
  loading.value = true
  try {
    const res = await getCacheGroupsAPI()
    cacheGroups.value = res?.data?.list || res?.list || []
  } catch (error) {
    cacheGroups.value = []
  } finally {
    loading.value = false
  }
}

const handleRefreshGroups = () => {
  keyword.value = ''
  currentGroup.value = null
  currentGroupKeys.value = []
  keyListTotal.value = 0
  pagination.page = 1
  detailData.value = {}
  loadGroups()
}

// #endregion

// #region 第二步：点击分组，加载键列表（带分页）

const handleGroupClick = async (row) => {
  currentGroup.value = row
  currentGroupKeys.value = []
  keyListTotal.value = 0
  pagination.page = 1
  keyword.value = ''
  detailData.value = {}

  loading.value = true
  try {
    const params = { page: pagination.page, pageSize: pagination.pageSize, keyword: keyword.value }
    const res = await getCacheKeysByGroupAPI(row.key, params)
    currentGroupKeys.value = res?.data?.list || res?.list || []
    keyListTotal.value = res?.data?.total || res?.total || 0
  } catch (error) {
    currentGroupKeys.value = []
  } finally {
    loading.value = false
  }
}

const handleRefreshKeys = () => {
  if (currentGroup.value) handleGroupClick(currentGroup.value)
}

const handleSearch = () => {
  pagination.page = 1
  handleRefreshKeys()
}

const handlePageChange = (page) => {
  pagination.page = page
  handleRefreshKeys()
}

// #endregion

// #region 清空缓存和重置统计

const handleClearAllCache = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有缓存吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }

  try {
    loading.value = true
    await clearCacheAPI()
    ElMessage.success('清空缓存成功')
    loadStats()
    if (currentGroup.value) {
      handleGroupClick(currentGroup.value)
    }
  } catch (error) {
    // 错误由 axios 拦截器处理
  } finally {
    loading.value = false
  }
}

const handleResetStats = async () => {
  try {
    await ElMessageBox.confirm('确定要重置缓存命中率统计吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    })
  } catch {
    return
  }

  try {
    await resetCacheStatsAPI()
    ElMessage.success('重置统计成功')
    loadStats()
  } catch (error) {
    // 错误由 axios 拦截器处理
  }
}

// #endregion

// #region 第三步：点击键名，查看详情

const handleKeyClick = async (row) => {
  detailData.value = {
    key: row.key,
    cacheName: row.cacheName,
    value: '加载中...',
    type: row.type,
    ttl: row.ttl,
    ttlFormatted: row.ttlFormatted,
    isExpired: row.isExpired,
    size: row.size,
  }

  try {
    loading.value = true
    const res = await getCacheDetailAPI(row.key)
    const detailDataRes = res?.data || res || {}
    detailData.value = {
      key: detailDataRes.key || row.key,
      cacheName: row.cacheName,
      type: detailDataRes.type || row.type,
      ttl: detailDataRes.ttl ?? row.ttl,
      ttlFormatted: detailDataRes.ttlFormatted || row.ttlFormatted,
      isExpired: detailDataRes.isExpired ?? row.isExpired,
      size: detailDataRes.size ?? row.size,
      value: detailDataRes.value ?? '无内容',
    }
  } catch (error) {
    detailData.value = {
      ...detailData.value,
      value: '获取缓存内容失败',
    }
  } finally {
    loading.value = false
  }
}

// #endregion

// #region 删除操作

const handleClearGroup = (row) => {
  ElMessageBox.confirm(`确认要清空"${row.name}"分组的所有缓存吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await clearCacheByGroupAPI(row.key)
        ElMessage.success(`已清空 ${row.count} 条缓存`)
        handleRefreshGroups()
      } catch (error) {
        ElMessage.error('清空分组失败')
      }
    })
    .catch(() => {})
}

const handleDeleteKey = (row) => {
  const displayName = row.cacheName || row.key
  ElMessageBox.confirm(`确认要删除缓存"${displayName}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteCacheAPI(row.key)
        ElMessage.success('删除成功')
        handleRefreshKeys()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {})
}

const handleClearAll = () => {
  ElMessageBox.confirm('确认要清空所有缓存吗？此操作不可恢复！', '严重警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error',
  })
    .then(async () => {
      try {
        const res = await clearCacheAPI()
        ElMessage.success(`已清空所有缓存，共 ${res?.data?.count || res?.count || 0} 条`)
        handleRefreshGroups()
      } catch (error) {
        ElMessage.error('清空失败')
      }
    })
    .catch(() => {})
}

// #endregion

// #region 生命周期

onMounted(() => {
  loadGroups()
  loadStats()
})

// #endregion
</script>

<style scoped>
.cache-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  gap: 12px;
}

/* 统计信息栏 */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 13px;
  color: #909399;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.info-icon {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
}

.stat-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.btn-text {
  margin-left: 4px;
  font-size: 13px;
}

/* 主体三栏布局 */
.cache-main {
  display: flex;
  flex: 1;
  min-height: 0;
  gap: 16px;
}

.cache-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;
  flex-shrink: 0;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.panel-body {
  flex: 1;
  overflow: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 自定义滚动条样式 */
.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}

.panel-body::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

.detail-body::-webkit-scrollbar {
  width: 6px;
}

.detail-body::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.detail-body::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}

.detail-body::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

.value-content::-webkit-scrollbar {
  width: 6px;
}

.value-content::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.value-content::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}

.value-content::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

.detail-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}

/* 面板宽度 */
.cache-name-panel {
  width: 220px;
  min-width: 180px;
  flex-shrink: 0;
}

.cache-key-panel {
  width: 380px;
  min-width: 300px;
  flex-shrink: 0;
}

.cache-detail-panel {
  flex: 1;
  min-width: 320px;
}

/* 搜索框 */
.search-box {
  margin-bottom: 10px;
  flex-shrink: 0;
}

/* 分页 */
.pagination-box {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

/* 详情描述 */
.detail-desc {
  margin-bottom: 12px;
}

/* 缓存值区域 */
.value-section {
  margin-top: 8px;
}

.value-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.value-label {
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.value-header .el-button {
  font-size: 12px;
  padding: 0;
  height: 24px;
  line-height: 24px;
}

.value-content {
  margin: 0;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  max-height: 280px;
  overflow-y: auto;
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-all;

  & code {
    font-family: inherit;
  }
}

/* 表格样式 */
:deep(.el-table) {
  --el-table-border-color: #ebeef5;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
}

:deep(.el-table .current-row > td.el-table__cell) {
  background-color: #ecf5ff !important;
}
</style>
