<template>
  <div class="health-container">
    <!-- #region 整体状态卡片 -->
    <el-card class="status-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统健康状态</span>
          <el-button type="primary" :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </div>
      </template>
      <div class="status-content">
        <div class="status-item">
          <span class="label">整体状态：</span>
          <el-tag :type="healthData.status === 'up' ? 'success' : 'danger'" size="large">
            {{ healthData.status === 'up' ? '正常' : '异常' }}
          </el-tag>
        </div>
        <div class="status-item">
          <span class="label">检查时间：</span>
          <span class="value">{{ formatTime(healthData.timestamp) }}</span>
        </div>
      </div>
    </el-card>
    <!-- #endregion -->

    <!-- #region 组件状态卡片 -->
    <el-card class="components-card" shadow="hover">
      <template #header>
        <span>组件状态</span>
      </template>
      <div v-if="Object.keys(healthData.components || {}).length > 0" class="components-grid">
        <div v-for="(component, name) in healthData.components" :key="name" class="component-item">
          <div class="component-header">
            <el-icon :size="24" :color="component.status === 'up' ? '#67C23A' : '#F56C6C'">
              <component :is="getComponentIcon(name)" />
            </el-icon>
            <span class="component-name">{{ getComponentLabel(name) }}</span>
          </div>
          <div class="component-status">
            <el-tag :type="component.status === 'up' ? 'success' : 'danger'" size="small">
              {{ component.status === 'up' ? '正常' : '异常' }}
            </el-tag>
          </div>
          <div v-if="component.latency !== undefined" class="component-latency">
            <span class="latency-label">响应时间：</span>
            <span class="latency-value">{{ component.latency }}ms</span>
          </div>
          <div v-if="component.message" class="component-message">
            {{ component.message }}
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无组件状态信息" />
    </el-card>
    <!-- #endregion -->

    <!-- #region 快速检查卡片 -->
    <el-card class="quick-check-card" shadow="hover">
      <template #header>
        <span>快速检查</span>
      </template>
      <div class="quick-check-buttons">
        <el-button type="primary" :loading="loadingReady" @click="checkReady"> 就绪检查（DB+Redis） </el-button>
        <el-button type="success" :loading="loadingLive" @click="checkLive"> 存活检查 </el-button>
      </div>
      <div v-if="quickCheckResult" class="quick-check-result">
        <el-alert
          :title="quickCheckResult.title"
          :type="quickCheckResult.type"
          :description="quickCheckResult.message"
          show-icon
          :closable="false"
        />
      </div>
    </el-card>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Coin, Connection, Cpu } from '@element-plus/icons-vue'
import { getHealthAPI, getHealthReadyAPI, getHealthLiveAPI } from '@/api/monitor/health'
import dayjs from 'dayjs'

defineOptions({
  name: 'MonitorHealthIndex',
})

// #region 数据定义

const healthData = ref({
  status: 'unknown',
  timestamp: '',
  components: {},
})

const loadingReady = ref(false)
const loadingLive = ref(false)
const quickCheckResult = ref(null)

// #endregion

// #region 数据获取

const getHealthData = async () => {
  try {
    const res = await getHealthAPI()
    // 接口返回格式：{ status: "up", timestamp: "2026-04-14T06:09:50.540Z", components: {} }
    healthData.value = res || {
      status: 'unknown',
      timestamp: '',
      components: {},
    }
  } catch (error) {
    console.error('获取健康状态失败:', error)
    ElMessage.error('获取健康状态失败')
  }
}

const handleRefresh = () => {
  getHealthData()
  quickCheckResult.value = null
}

// #endregion

// #region 快速检查

const checkReady = async () => {
  loadingReady.value = true
  try {
    const res = await getHealthReadyAPI()
    quickCheckResult.value = {
      title: '就绪检查通过',
      type: 'success',
      message: `系统就绪，数据库和 Redis 连接正常。检查时间：${formatTime(res.timestamp)}`,
    }
  } catch (error) {
    console.error('就绪检查失败:', error)
    quickCheckResult.value = {
      title: '就绪检查失败',
      type: 'error',
      message: '系统未就绪，请检查数据库和 Redis 连接',
    }
  } finally {
    loadingReady.value = false
  }
}

const checkLive = async () => {
  loadingLive.value = true
  try {
    await getHealthLiveAPI()
    quickCheckResult.value = {
      title: '存活检查通过',
      type: 'success',
      message: '系统运行正常',
    }
  } catch (error) {
    console.error('存活检查失败:', error)
    quickCheckResult.value = {
      title: '存活检查失败',
      type: 'error',
      message: '系统无法响应',
    }
  } finally {
    loadingLive.value = false
  }
}

// #endregion

// #region 工具函数

const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const getComponentIcon = (name) => {
  const iconMap = {
    database: Coin,
    redis: Connection,
    default: Cpu,
  }
  return iconMap[name.toLowerCase()] || iconMap.default
}

const getComponentLabel = (name) => {
  const labelMap = {
    database: '数据库',
    redis: 'Redis',
    mongodb: 'MongoDB',
    mysql: 'MySQL',
    postgresql: 'PostgreSQL',
  }
  return labelMap[name.toLowerCase()] || name
}

// #endregion

// #region 生命周期

onMounted(() => {
  getHealthData()
})

// #endregion
</script>

<style scoped>
.health-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
  min-height: 100vh;
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-card {
  margin-bottom: 16px;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-item .label {
  font-weight: 500;
  color: #606266;
}

.status-item .value {
  color: #303133;
}

.components-card {
  margin-bottom: 16px;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.component-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  transition: all 0.3s;
}

.component-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.component-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.component-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.component-status {
  margin-bottom: 8px;
}

.component-latency {
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
}

.latency-label {
  font-weight: 500;
}

.latency-value {
  color: #409eff;
  font-weight: 500;
}

.component-message {
  font-size: 12px;
  color: #909399;
  word-break: break-all;
}

.quick-check-card {
  margin-bottom: 16px;
}

.quick-check-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.quick-check-result {
  margin-top: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .components-grid {
    grid-template-columns: 1fr;
  }

  .quick-check-buttons {
    flex-direction: column;
  }

  .quick-check-buttons .el-button {
    width: 100%;
  }
}
</style>
