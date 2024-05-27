<template>
  <div class="layout-container">
    <!--左侧菜单 -->
    <div class="layout-sider">
      <Logo />
    </div>

    <!--顶部导航 -->
    <div class="layout-tabbar">456</div>

    <!--内容展示区 -->
    <div class="layout-main">789</div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/components/Logo';
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;

  .layout-sider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
  }

  .layout-tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: cyan;
  }

  .layout-main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    overflow: auto;
  }
}
</style>
