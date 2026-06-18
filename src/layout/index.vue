<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapsed ? '64px' : '200px'" class="layout-aside">
      <div class="layout-logo">
        <span v-if="!isCollapsed" class="logo-text">Vue Admin</span>
        <span v-else class="logo-mini">VA</span>
      </div>
      <el-scrollbar class="layout-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :router="true"
          :collapse="isCollapsed"
          :unique-opened="true"
          class="layout-menu"
          background-color="#001529"
          text-color="rgba(255, 255, 255, 0.65)"
          active-text-color="#fff"
        >
          <sidebar-item v-for="menu in menus" :key="menu.key" :item="menu" />
        </el-menu>
      </el-scrollbar>
      <div class="layout-collapse-btn" @click="toggleCollapsed">
        <el-icon :size="18">
          <Expand v-if="isCollapsed" />
          <Fold v-else />
        </el-icon>
      </div>
    </el-aside>
    <el-container class="layout-main">
      <layout-header />
      <el-scrollbar class="main-scrollbar">
        <el-main class="layout-content">
          <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in">
              <keep-alive :include="cachedRoutes">
                <component :is="Component" :key="route.name" />
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
      </el-scrollbar>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { useLayoutStore } from '@/store/layout'
import SidebarItem from './components/SidebarItem.vue'
import LayoutHeader from './components/LayoutHeader.vue'

const route = useRoute()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const layoutStore = useLayoutStore()

const activeMenu = computed(() => route.path)
const menus = computed(() => userStore.menus)
const cachedRoutes = computed(() => permissionStore.cachedRoutes)
const isCollapsed = computed(() => layoutStore.isCollapsed)
const toggleCollapsed = () => layoutStore.toggleCollapsed()
</script>

<style scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
}

.layout-aside {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #001529;
  transition: width 0.3s ease;
}

.layout-logo {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: #002140;
  overflow: hidden;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.logo-mini {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.layout-scrollbar {
  flex: 1;
  min-height: 0;
}

.layout-scrollbar :deep(.el-scrollbar__view) {
  height: auto;
}

.layout-menu {
  border-right: none;
}

.layout-collapse-btn {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 48px;
  color: rgb(255 255 255 / 65%);
  cursor: pointer;
  border-top: 1px solid rgb(255 255 255 / 10%);
  transition: all 0.3s ease;
}

.layout-collapse-btn:hover {
  color: #fff;
  background-color: rgb(255 255 255 / 5%);
}

.layout-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.main-scrollbar {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.main-scrollbar :deep(.el-scrollbar__view) {
  height: auto;
  min-height: 100%;
}

.layout-content {
  height: 100%;
  padding: 0;
  background-color: #f0f2f5;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
