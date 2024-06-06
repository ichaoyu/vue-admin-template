<template>
  <el-container class="layout">
    <el-aside :class="['layout-aside', collapse ? 'fold' : '']">
      <Logo :collapse="collapse" />
      <el-scrollbar>
        <Menu :menuList="menuList" :collapse="collapse" />
      </el-scrollbar>
      <div class="layout-aside-opr">
        <el-icon class="icon icon-menufold">
          <component
            :is="collapse ? 'Expand' : 'Fold'"
            @click="onChangeMenuFold"
          />
        </el-icon>
      </div>
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

      <el-main class="layout-main">
        <router-view>
          <template #default="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </template>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { usePermissionStore } from '@/store/modules/permission';
import { useAppStore } from '@/store/modules/app';

import Logo from './components/Logo.vue';
import Menu from './components/Menu.vue';
import HeaderBreadcrumb from './components/HeaderBreadcrumb.vue';
import HeaderSettings from './components/HeaderSettings.vue';

const appStore = useAppStore();
const collapse = computed(() => appStore.getCollapse);

const permissionStore = usePermissionStore();
const menuList = computed(() => permissionStore.getRouters);
const onChangeMenuFold = () => {
  appStore.setCollapse(!collapse.value);
};
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
    border-right: 1px solid var(--el-menu-border-color);

    :deep(.el-scrollbar) {
      height: calc(100vh - $base-menu-opr-height - $base-menu-logo-height);
    }

    &.fold {
      width: $base-menu-min-width;
    }

    &-opr {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: flex-end;
      height: $base-menu-opr-height;
      padding: 0 10px;
      cursor: pointer;

      .icon {
        font-size: 20px;
      }
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
