<template>
  <el-result icon="warning" title="500" sub-title="抱歉，服务器出错了">
    <template #extra>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </template>
  </el-result>
</template>

<script setup>
const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.el-result {
  height: 100vh;
}
</style>
