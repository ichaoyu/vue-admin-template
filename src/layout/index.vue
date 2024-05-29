<template>
  <el-container class="layout">
    <el-aside :class="['layout-aside', SettingsStore.menuFold ? 'fold' : '']">
      <Logo />
      <el-scrollbar>
        <Menu :menuList="userStore.menuRoutes" />
      </el-scrollbar>
    </el-aside>
    <el-container class="layout-container">
      <el-header class="layout-header">
        <div class="tabbar-left">
          <!--顶部左侧图标 -->
          <HeaderBreadcrumb />
        </div>
        <!--顶部右侧设置按钮 -->
        <div class="tabbar-right">
          <HeaderSettings />
        </div>
      </el-header>

      <!-- <el-scrollbar class="layout-container-scrollbar"> -->
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <!-- 渲染一级路由的子路由 -->
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
      <!-- </el-scrollbar> -->
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/seeings';

import Logo from '@/components/Logo';
import Menu from './components/Menu.vue';
import HeaderBreadcrumb from './components/HeaderBreadcrumb.vue';
import HeaderSettings from './components/HeaderSettings.vue';

const userStore = useUserStore();

const SettingsStore = useSettingsStore();
</script>

<style scoped lang="scss">
.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  &-aside {
    // --el-aside-width: $base-menu-width;

    box-sizing: border-box;
    width: $base-menu-width;
    overflow: hidden;
    transition: all 0.3s;

    &.fold {
      width: $base-menu-min-width;
    }
  }

  &-container {
    height: 100%;
  }

  &-header {
    display: flex;
    box-sizing: border-box;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    height: $base-tabbar-height;
    font-size: 12px;
    text-align: right;

    .tabbar-left {
      display: flex;
      align-items: center; //Y轴侧轴居中
      margin-left: 20px;
    }

    .tabbar-right {
      display: flex;
      align-items: center; //Y轴侧轴居中
    }
  }

  &-scrollbar {
    width: 100%;
    // padding: 10px;
  }

  &-main {
    overflow-y: auto;
  }
}

.fade-enter-from {
  transform: scale(0);
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  transform: scale(1);
  opacity: 1;
}
</style>
