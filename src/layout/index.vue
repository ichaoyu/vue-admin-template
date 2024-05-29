<template>
  <el-container class="layout">
    <el-aside class="layout-aside">
      <Logo />
      <el-scrollbar>
        <Menu :isCollapse="isCollapse" :menuList="userStore.menuRoutes" />
      </el-scrollbar>
    </el-aside>
    <el-container class="layout-container">
      <el-header class="layout-header">
        <el-button @click="onCollapseMenu">展开/折叠</el-button>
        <div class="layout-header-toolbar">
          <el-dropdown>
            <el-icon style="margin-top: 1px; margin-right: 8px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>Tom</span>
        </div>
      </el-header>

      <!-- <el-scrollbar class="layout-container-scrollbar"> -->
      <el-main class="layout-main">
        <el-table :data="tableData">
          <el-table-column prop="date" label="Date" width="140" />
          <el-table-column prop="name" label="Name" width="120" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </el-main>
      <!-- </el-scrollbar> -->
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Menu from './Menu.vue';
import Logo from '@/components/Logo';
import useUserStore from '@/store/modules/user';

const userStore = useUserStore();
const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
};
const tableData = ref(Array.from({ length: 20 }).fill(item));

const isCollapse = ref<boolean>(false);
const onCollapseMenu = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &-aside {
    --el-aside-width: 200px;

    box-sizing: border-box;
    overflow: hidden;
    // width: $base-menu-width;
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

    &-toolbar {
      display: inline-flex;
      right: 20px;
      align-items: center;
      justify-content: center;
      height: 100%;
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
</style>
