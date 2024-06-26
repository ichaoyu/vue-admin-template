import router from './index';

import { useNProgress } from '@/hooks/useNProgress';
import { useUserStoreOut } from '@/store/modules/user';

const { start, done } = useNProgress();

const NO_REDIRECT_WHITE_LIST = ['/login'];

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  start();
  const { getRoleIDs, getToken } = useUserStoreOut();
  let hasPermission = true;
  // 未设置meta.roles的路由直接放行
  if (!to?.meta?.roles || to?.meta?.roles.length < 1) {
    hasPermission = true;
  } else {
    hasPermission = to?.meta?.roles?.some((role: string) =>
      getRoleIDs?.includes(role),
    );
  }
  // 已登录
  if (getToken) {
    // 当前用户有访问路由的权限
    if (hasPermission) {
      next();
      return;
    }
    // 当前用户没有访问路由的权限
    next('/403');
  } else {
    // 未登录
    // 不需要登录权限
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next();
    } else {
      // 重定向到登录页
      const path = !['/404', '/403'].includes(to.path)
        ? `/login?redirect=${to.path}`
        : '/login';
      next(path);
    }
  }
});
//全局后置守卫
router.afterEach((to) => {
  document.title = to?.meta?.title as string;
  done();
});
