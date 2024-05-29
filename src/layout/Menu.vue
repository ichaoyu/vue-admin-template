<template>
  <!-- <el-scrollbar class="aside-scrollbar"> -->
  <el-menu default-active="2" class="aside-menu" :collapse="props.isCollapse">
    <template v-for="item in menuList" :key="item.path">
      <!--没有子路由-->
      <template v-if="!item.children">
        <el-menu-item
          :index="item.path"
          v-if="!item.meta.hidden"
          @click="goRoute"
        >
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <template #title>{{ item.meta.title }}</template>
        </el-menu-item>
      </template>
      <!-- 只有一个子路由 -->
      <!-- <template v-if="item.children && item.children.length == 1">
          <el-menu-item
            :index="item.children[0].path"
            v-if="!item.children[0].meta.hidden"
            @click="goRoute"
          >
            <el-icon><component :is="item.children[0].meta.icon" /></el-icon>
            <template #title>{{ item.children[0].meta.title }}</template>
          </el-menu-item>
        </template> -->
      <!-- 子路由 -->
      <el-sub-menu
        :index="item.path"
        v-if="item.children && item.children.length > 0"
      >
        <template #title>
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <!-- <el-menu-item-group> -->
        <Menu :menuList="item.children" />
        <!-- </el-menu-item-group> -->
      </el-sub-menu>
    </template>
  </el-menu>
  <!-- </el-scrollbar> -->
</template>
<script lang="ts">
export default {
  name: 'Menu',
};
</script>
<script lang="ts" setup>
import { defineProps } from 'vue';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';

import { findPath } from '@/utils';

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
  menuList: {
    type: Array as PropType<AppRouteRecordRaw[]>,
    default: () => [],
  },
});
const getAllParentPath = <T = Recordable,>(treeData: T[], path: string) => {
  const menuList = findPath(
    treeData,
    (n) => n.path === path,
  ) as AppRouteRecordRaw[];
  return (menuList || []).map((item) => item.path);
};
//获取路由器对象
let $router = useRouter();
//点击菜单的回调
const goRoute = (vc: any) => {
  const routes = getAllParentPath(props.menuList, vc);
  console.log('routes: ', routes);
  console.log('vc: ', JSON.parse(JSON.stringify(vc)));
  //路由跳转
  $router.push(vc.index);
};
</script>

<style lang="scss" scoped>
.aside-scrollbar {
  width: 100%;
}

.aside-menu:not(.el-menu--collapse) {
  width: $base-menu-width;
}
</style>
