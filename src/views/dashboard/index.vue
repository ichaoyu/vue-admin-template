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
                <h3>Total Users</h3>
                <p>1,234</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <h3>Active Users</h3>
                <p>876</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-content">
                <h3>Tasks</h3>
                <p>456</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup></script>

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
