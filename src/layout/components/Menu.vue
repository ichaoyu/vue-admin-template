<template>
  <el-menu class="aside-menu" :collapse="collapse" :default-active="route.path">
    <template v-for="item in props.menuList" :key="item.path">
      <!--没有子路由-->
      <template v-if="!item.children">
        <el-menu-item
          :index="getPath(parentPath, item.path)"
          v-if="!item.meta.hidden"
          @click="goRoute"
        >
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <template #title>{{ item.meta.title }}</template>
        </el-menu-item>
      </template>
      <!-- 有子路由 -->
      <el-sub-menu v-else :index="getPath(parentPath, item.path)">
        <template #title>
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu
          :menuList="item.children"
          :parent-path="getPath(parentPath, item.path)"
        />
      </el-sub-menu>
    </template>
  </el-menu>
</template>
<script lang="ts">
export default {
  name: 'Menu',
};
</script>
<script lang="ts" setup>
import type { PropType } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  menuList: {
    type: Array as PropType<AppRouteRecordRaw[]>,
    default: () => [],
  },
  parentPath: {
    type: String,
    default: '',
  },
  collapse: {
    type: Boolean,
    defaulat: false,
  },
});
//获取路由器对象
const router = useRouter();
const route = useRoute();
//点击菜单的回调
const goRoute = (vc: any) => {
  //路由跳转
  router.push(vc.index);
};

const getPath = (parentPath: string, path: string) => {
  const fullpath = parentPath ? `${parentPath}/${path}` : path;
  return fullpath;
};
</script>

<style lang="scss" scoped>
.aside-scrollbar {
  width: 100%;
}

.aside-menu {
  border-right: none;

  &:not(.el-menu--collapse) {
    width: $base-menu-width;
  }
}
</style>
