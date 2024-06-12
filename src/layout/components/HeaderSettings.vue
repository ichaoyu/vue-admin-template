<template>
  <el-space>
    <el-button size="small" icon="FullScreen" circle @click="onFullScreen" />
    <el-button size="small" icon="Setting" circle />

    <el-dropdown>
      <span class="avatar-box">
        <el-avatar :icon="UserFilled" size="small" class="icon" />
        admin
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>个人设置</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-space>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
const onFullScreen = () => {
  const full = document.fullscreenElement;
  if (!full) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
</script>

<style scoped lang="scss">
.avatar-box {
  @include flex-layout();

  cursor: pointer;

  .icon {
    margin-right: 5px;
  }
}
</style>
