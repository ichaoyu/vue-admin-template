import router from '@/router';
import { useNProgress } from '@/hooks/useNProgress';
import settings from '../config/settings';
import useUserStoreWithOut from '@/store/modules/user';
import { useStorage } from '@/hooks/useStorage';

const { start, done } = useNProgress();
const { getStorage } = useStorage();
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  start();
  const userStore = useUserStoreWithOut();
  document.title = `${settings.title} - ${to.meta.title}`;
  // 获取token,判断是否登录
  const token = userStore.getToken;
  const userInfo = getStorage('USERINFO');
  //用户登录判断
  if (token) {
    if (to.path == '/login') {
      //已登录访问login则跳转到首页
      next({ path: '/' });
    } else {
      // 登录成功访问其余六个路由(登录排除)
      if (userInfo) {
        //有用户信息
        next();
      } else {
        // 没有用户信息则获取用户信息再放行
        try {
          // await userStore.userInfo(); //获取用户信息
          console.log('获取用户信息');
          //放行
          next({ ...to });
        } catch (error) {
          // token过期
          // userStore.userLogout();
          console.log('token过期');
          next({ path: '/login', query: { redirect: to.path } });
        }
      }
    }
  } else {
    //用户未登录判断
    if (to.path == '/login') {
      next();
    } else {
      next({ path: '/login', query: { redirect: to.path } });
    }
  }
});
//全局后置守卫
router.afterEach((to) => {
  document.title = to?.meta?.title as string;
  done();
});
