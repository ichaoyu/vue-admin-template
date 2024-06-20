import router from './index';

import { useNProgress } from '@/hooks/useNProgress';
import { useUserStoreOut } from '@/store/modules/user';

const { start, done } = useNProgress();

const NO_REDIRECT_WHITE_LIST = ['/login'];

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  start();
  const { getRoleIDs, getToken } = useUserStoreOut();
  const hasPermission = to?.meat?.roles.some((role) =>
    getRoleIDs?.includes(role),
  );
  // 已登录
  if (getToken) {
    console.log('!to?.meta?.requireAuth: ', !to?.meta?.requireAuth);
    // 路由不需要鉴权 或 当前用户有访问路由的权限
    if (!to?.meta?.requireAuth || hasPermission) {
      next();
      return true;
    }
    // 当前用户没有访问路由的权限
    const redirectPath = from.query.redirect || to.path;
    const redirect = decodeURIComponent(redirectPath as string);
    const nextData =
      to.path === redirect ? { ...to, replace: true } : { path: redirect };
    console.log('nextData: ', nextData);
    next('/403');
  } else {
    // 未登录
    // 不需要登录权限
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
