//对外暴露配置路由
export const constantRoute: AppRouteRecordRaw[] = [
  {
    //登录路由
    path: '/login',
    component: () => import('@/views/login'),
    name: 'login', //命名路由
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true,
    },
  },
  {
    //登录成功后展示数据路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      hidden: true,
    },
  },
  {
    //404路由
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    name: '404',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true,
    },
  },
  {
    //任意路由，上面都没有匹配，重定向到404页面
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true,
    },
  },
];
