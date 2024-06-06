import router from '@/router';
import type { RouteRecordRaw } from 'vue-router';

import { useNProgress } from '@/hooks/useNProgress';
import { useUserStoreOut } from '@/store/modules/user';
import { useAppStoreOut } from '@/store/modules/app';
import { usePermissionStoreOut } from '@/store/modules/permission';

const { start, done } = useNProgress();

const NO_REDIRECT_WHITE_LIST = ['/login'];

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  start();
  const userStore = useUserStoreOut();
  const permissionStore = usePermissionStoreOut();
  const appStore = useAppStoreOut();
  if (userStore.getUserInfo) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (permissionStore.getIsAddRouters) {
        next();
        return;
      }

      // 开发者可根据实际情况进行修改
      const roleRouters = userStore.getRoleRouters || [];

      // 是否使用动态路由
      if (appStore.getDynamicRouter) {
        appStore.serverDynamicRouter
          ? await permissionStore.generateRoutes(
              'server',
              roleRouters as AppCustomRouteRecordRaw[],
            )
          : await permissionStore.generateRoutes(
              'frontEnd',
              roleRouters as string[],
            );
      } else {
        await permissionStore.generateRoutes('static');
      }

      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw); // 动态添加可访问路由表
      });
      const redirectPath = from.query.redirect || to.path;
      const redirect = decodeURIComponent(redirectPath as string);
      const nextData =
        to.path === redirect ? { ...to, replace: true } : { path: redirect };
      permissionStore.setIsAddRouters(true);
      next(nextData);
    }
  } else {
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`); // 否则全部重定向到登录页
    }
  }
});
//全局后置守卫
router.afterEach((to) => {
  document.title = to?.meta?.title as string;
  done();
});
