<template>
  <el-menu
    class="aside-menu"
    :collapse="collapse"
    :default-active="currentPath.activeMenuItem"
    :default-openeds="currentPath.opend"
  >
    <template v-for="item in routeList" :key="item.path">
      <!--没有子路由-->
      <template v-if="!item.children">
        <el-menu-item
          :index="pathResolve(parentPath, item.path)"
          v-if="!item.meta.hidden"
          @click="goRoute"
        >
          <icon-font :name="item.meta.icon" class="menu-icon" />
          <template #title>{{ item.meta.title }}</template>
        </el-menu-item>
      </template>
      <!-- 有子路由但是只有一个子路由 -->
      <template v-if="item.children && item.children.length == 1">
        <el-menu-item
          :index="pathResolve(item.path, item.children[0].path)"
          v-if="!item.children[0].meta.hidden"
          @click="goRoute"
        >
          <icon-font :name="item.meta.icon" class="menu-icon" />
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有多个子路由 -->
      <el-sub-menu
        v-if="item.children && item.children.length > 1 && !item.meta.hidden"
        :index="pathResolve(parentPath, item.path)"
      >
        <template #title>
          <icon-font :name="item.meta.icon" class="menu-icon" />
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu
          :menuList="item.children"
          :parent-path="pathResolve(parentPath, item.path)"
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
import { computed, type PropType } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { pathResolve } from '@/utils';
import { useUserStore } from '@/store/modules/user';

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
const currentPath = computed(() => {
  const opend = route.matched.map((item) => item.path);
  return {
    activeMenuItem: route.path,
    opend,
  };
});
//点击菜单的回调
const goRoute = (vc: any) => {
  //路由跳转
  router.push(vc.index);
};

const { getRoleIDs } = useUserStore();
// 过滤路由权限，也可以通过v-auth在template中实现
const filterRouters = (routers: AppRouteRecordRaw[]) => {
  if (!getRoleIDs) return routers;
  return routers.filter((router) => {
    if (!router.meta.roles) return true;
    const roles = [...router.meta.roles];
    if (router.children) {
      filterRouters(router.children);
    }
    return roles.some((role) => getRoleIDs.includes(role));
  });
};
const routeList: AppRouteRecordRaw[] = filterRouters(props.menuList);
</script>

<style lang="scss" scoped>
.aside-scrollbar {
  width: 100%;
}

.aside-menu {
  border-right: none;
  background: none;

  &:not(.el-menu--collapse) {
    width: var(--base-menu-width);
  }

  .menu-icon {
    width: 15px;
    height: 15px;
    margin-right: 6px;
  }
}
</style>
