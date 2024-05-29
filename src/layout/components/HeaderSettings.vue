<template>
  <el-button size="small" icon="FullScreen" circle @click="onFullScreen" />
  <el-button size="small" icon="Setting" circle />
  <el-icon><Avatar /></el-icon>
  <el-dropdown>
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
const onFullScreen = () => {
  const full = document.fullscreenElement;
  if (!full) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
</script>

<style scoped lang="scss"></style>
