<template>
  <el-container class="layout">
    <el-header class="layout-header">
      <div class="tabbar-left">
        <Logo :collapse="collapse" :title="title" />
        <!--顶部左侧图标 -->
        <!-- <HeaderBreadcrumb /> -->
      </div>
      <!--顶部右侧设置按钮 -->
      <div class="tabbar-right">
        <HeaderSettings />
      </div>
    </el-header>

    <el-container class="layout-container">
      <el-aside :class="['layout-aside', collapse ? 'fold' : '']">
        <el-scrollbar class="menu-scroll">
          <Menu :menuList="menuList" :collapse="collapse" />
        </el-scrollbar>
        <div
          :class="['layout-aside-opr', collapse ? 'layout-aside-collapse' : '']"
        >
          <el-switch
            v-model="isDark"
            :active-icon="Moon"
            :inactive-icon="Sunny"
            inline-prompt
            @change="toggleDark"
          />
          <el-icon class="icon icon-menufold">
            <component
              :is="collapse ? 'Expand' : 'Fold'"
              @click="onChangeMenuFold"
            />
          </el-icon>
        </div>
      </el-aside>

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
import { Sunny, Moon } from '@element-plus/icons-vue';
import Logo from './components/Logo.vue';
import Menu from './components/Menu.vue';
// import HeaderBreadcrumb from './components/HeaderBreadcrumb.vue';
import HeaderSettings from './components/HeaderSettings.vue';

const appStore = useAppStore();
const collapse = computed(() => appStore.getCollapse);

const permissionStore = usePermissionStore();
const menuList = computed(() => permissionStore.getRouters);
const title = computed(() => appStore.getTitle);
const onChangeMenuFold = () => {
  appStore.setCollapse(!collapse.value);
};

const isDark = computed(() => appStore.getIsDark);
const toggleDark = () => {
  appStore.setIsDark(!isDark.value);
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
    box-shadow: var(--shadow-length-connected-overlay, 0 2px 8px 0)
      var(--shadow-color, rgb(37 43 58 / 100%));

    .menu-scroll {
      height: calc(100vh - $base-menu-opr-height - $base-menu-logo-height);
    }

    &.fold {
      width: $base-menu-min-width;
    }

    &-opr {
      @include flex-layout($justify: space-around);

      height: $base-menu-opr-height;
      padding: 0 10px;
      cursor: pointer;

      .icon {
        font-size: 20px;
      }
    }

    &-collapse {
      flex-flow: column nowrap;
    }
  }

  &-container {
    height: 100%;
  }

  &-header {
    @include flex-layout($justify: space-between);

    box-sizing: border-box;
    height: $base-tabbar-height;
    box-shadow: var(--shadow-length-connected-overlay, 0 2px 8px 0)
      var(--shadow-color, rgb(37 43 58 / 10%));
    font-size: 12px;
    text-align: right;

    .tabbar-left {
      @include flex-layout();
    }

    .tabbar-right {
      @include flex-layout();
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
