<template>
  <el-result icon="warning" title="404" sub-title="抱歉，您访问的页面不存在">
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
