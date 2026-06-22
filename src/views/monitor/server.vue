<template>
  <div class="server-container">
    <!-- #region 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Refresh" :loading="loading" @click="getData">刷新</el-button>
    </div>
    <!-- #endregion -->

    <!-- #region 主体：多卡片布局 -->
    <el-row :gutter="16">
      <!-- 左侧：CPU 和内存信息 -->
      <el-col :span="12">
        <!-- CPU 信息 -->
        <el-card shadow="hover" class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Monitor /></el-icon>
              <span>CPU 信息</span>
            </div>
          </template>
          <el-table :data="serverInfo.cpu" border size="small" :show-header="true">
            <el-table-column prop="key" label="属性" min-width="120" />
            <el-table-column prop="value" label="值" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">{{ formatCpuValue(row) }}</template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 内存信息 -->
        <el-card shadow="hover" class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Coin /></el-icon>
              <span>内存信息</span>
            </div>
          </template>
          <el-table :data="serverInfo.mem" border size="small" :show-header="true">
            <el-table-column prop="key" label="属性" min-width="120" />
            <el-table-column prop="sys" label="系统值" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">{{ formatMemValue(row, 'sys') }}</template>
            </el-table-column>
            <el-table-column prop="node" label="Node 值" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">{{ formatMemValue(row, 'node') }}</template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- Node.js 信息 -->
        <el-card shadow="hover" class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Connection /></el-icon>
              <span>Node.js 信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="Node 版本">{{ serverInfo.node?.version || '-' }}</el-descriptions-item>
            <el-descriptions-item label="Node 路径">{{ serverInfo.node?.nodePath || '-' }}</el-descriptions-item>
            <el-descriptions-item label="文件路径">{{ serverInfo.node?.filePath || '-' }}</el-descriptions-item>
            <el-descriptions-item label="运行时间">
              {{ formatUptime(serverInfo.node?.uptime) || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="启动参数">
              <el-tag v-for="(arg, index) in serverInfo.node?.args || []" :key="index" size="small" class="arg-tag">
                {{ arg }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 右侧：操作系统、磁盘和 Redis 信息 -->
      <el-col :span="12">
        <!-- 操作系统信息 -->
        <el-card shadow="hover" class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Platform /></el-icon>
              <span>操作系统信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="操作系统">{{ serverInfo.os?.platform || '-' }}</el-descriptions-item>
            <el-descriptions-item label="系统类型">{{ serverInfo.os?.distro || '-' }}</el-descriptions-item>
            <el-descriptions-item label="系统版本">{{ serverInfo.os?.release || '-' }}</el-descriptions-item>
            <el-descriptions-item label="内核版本">{{ serverInfo.os?.kernel || '-' }}</el-descriptions-item>
            <el-descriptions-item label="系统架构">{{ serverInfo.os?.arch || '-' }}</el-descriptions-item>
            <el-descriptions-item label="主机名">{{ serverInfo.os?.hostname || '-' }}</el-descriptions-item>
            <el-descriptions-item label="IP 地址" :span="2">{{ serverInfo.os?.ip || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 磁盘信息 -->
        <el-card shadow="hover" class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><Folder /></el-icon>
              <span>磁盘信息</span>
            </div>
          </template>
          <el-table :data="serverInfo.disk" border size="small">
            <el-table-column prop="fs" label="盘符路径" min-width="100" show-overflow-tooltip />
            <el-table-column prop="type" label="文件系统" width="100" />
            <el-table-column prop="size" label="总大小" width="90" align="center">
              <template #default="{ row }">{{ formatSize(row.size) }}</template>
            </el-table-column>
            <el-table-column prop="used" label="已用" width="90" align="center">
              <template #default="{ row }">{{ formatSize(row.used) }}</template>
            </el-table-column>
            <el-table-column prop="available" label="可用" width="90" align="center">
              <template #default="{ row }">{{ formatSize(row.available) }}</template>
            </el-table-column>
            <el-table-column prop="use" label="使用率" width="120" align="center">
              <template #default="{ row }">
                <el-progress
                  :percentage="parseFloat(row.use) || 0"
                  :color="getProgressColor(parseFloat(row.use) || 0)"
                  :stroke-width="18"
                />
              </template>
            </el-table-column>
            <el-table-column prop="mount" label="挂载点" min-width="120" show-overflow-tooltip />
          </el-table>
        </el-card>

        <!-- Redis 信息 -->
        <el-card shadow="hover" class="info-card">
          <template #header>
            <div class="card-header">
              <el-icon><DataLine /></el-icon>
              <span>Redis 信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="Redis 版本">{{ serverInfo.redis?.redis_version || '-' }}</el-descriptions-item>
            <el-descriptions-item label="运行模式">{{ serverInfo.redis?.redis_mode || '-' }}</el-descriptions-item>
            <el-descriptions-item label="数据库大小">{{ serverInfo.redis?.db_size ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="已用内存">{{ serverInfo.redis?.used_memory || '-' }}</el-descriptions-item>
            <el-descriptions-item label="连接客户端数" :span="2">{{
              serverInfo.redis?.connected_clients ?? '-'
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { Refresh, Monitor, Coin, Platform, Folder, Connection, DataLine } from '@element-plus/icons-vue'
import { getServerInfoAPI } from '@/api/monitor/server'

defineOptions({
  name: 'MonitorServerIndex',
})

// #region 数据定义

const loading = ref(false)
const serverInfo = reactive({
  cpu: [],
  mem: [],
  os: {},
  disk: [],
  node: {},
  redis: {},
})

let timer = null

// #endregion

// #region 数据获取

const getData = async () => {
  loading.value = true
  try {
    const res = await getServerInfoAPI()
    serverInfo.cpu = res?.cpu || []
    serverInfo.mem = res?.mem || []
    serverInfo.os = res?.os || {}
    serverInfo.disk = res?.disk || []
    serverInfo.node = res?.node || {}
    serverInfo.redis = res?.redis || {}
  } catch (error) {
    // 错误由 axios 拦截器处理
  } finally {
    loading.value = false
  }
}

// #endregion

// #region 工具方法

const getProgressColor = (percentage) => {
  if (percentage < 50) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

/**
 * 格式化文件大小
 */
const formatSize = (bytes) => {
  if ((bytes !== 0 && !bytes) || bytes === undefined) return '-'
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

/**
 * 格式化运行时间
 */
const formatUptime = (seconds) => {
  if (seconds === undefined || seconds === null) return '-'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${days}天${hours}时${minutes}分${secs}秒`
}

const formatCpuValue = (row) => {
  if (row.value === undefined || row.value === null) return '-'
  if (row.key === '核心数') return `${row.value} 核`
  return `${Number(row.value).toFixed(1)}%`
}

const formatMemValue = (row, field) => {
  const val = row[field]
  if (val === undefined || val === null) return '-'
  if (row.key === '使用率') return `${(Number(val) * 100).toFixed(1)}%`
  return formatSize(val)
}

// #endregion

// #region 生命周期

onMounted(() => {
  getData()
  timer = setInterval(getData, 30000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

// #endregion
</script>

<style scoped>
.server-container {
  padding: 16px;
  box-sizing: border-box;
}

.toolbar {
  margin-bottom: 16px;
}

.info-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #303133;
}

.card-header .el-icon {
  font-size: 18px;
  color: #409eff;
}

.arg-tag {
  margin-right: 4px;
}
</style>
