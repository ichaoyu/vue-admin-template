<template>
  <div class="dashboard">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>Dashboard</span>
        </div>
      </template>
      <div class="dashboard-stats">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <h3>用户总数</h3>
                <p>{{ stats.totalUsers }}</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <h3>在线用户</h3>
                <p>{{ stats.onlineUsers }}</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <h3>今日操作</h3>
                <p>{{ stats.todayOperations }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { getServerStatsAPI } from '@/api/monitor/server'

defineOptions({
  name: 'DashboardIndex',
})

// #region 数据定义

const stats = reactive({
  totalUsers: 0,
  onlineUsers: 0,
  todayOperations: 0,
})

// #endregion

// #region 数据加载

const loadStats = async () => {
  try {
    const res = await getServerStatsAPI()
    if (res) {
      stats.totalUsers = res.totalUsers || 0
      stats.onlineUsers = res.onlineUsers || 0
      stats.todayOperations = res.todayOperations || 0
    }
  } catch (error) {
    // 错误由 axios 拦截器处理，保留默认值 0
  }
}

// #endregion

// #region 生命周期

onMounted(() => {
  loadStats()
})

// #endregion
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-stats {
  margin-top: 20px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.stat-content h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #606266;
}

.stat-content p {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}
</style>
