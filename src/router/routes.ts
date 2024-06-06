import { Layout } from '@/utils';

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
    component: Layout,
    redirect: '/dashboard',
    name: 'layout',
    meta: {
      hidden: true,
      icon: '',
      title: '',
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
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: 'dashboard',
      icon: 'HomeFilled',
      alwaysShow: true,
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/home'),
        name: 'Analysis',
        meta: {
          title: 'analysis',
          noCache: true,
          affix: true,
        },
      },
      {
        path: 'workplace',
        component: () => import('@/views/home'),
        name: 'Workplace',
        meta: {
          title: 'Workplace',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/onechild',
    component: Layout,
    meta: {
      title: 'onechild-P',
      icon: 'Grid',
      alwaysShow: true,
    },
    name: 'onechild-P',
    children: [
      {
        path: 'onechild',
        component: () => import('@/views/home'),
        name: 'onechild',
        meta: {
          title: 'onechild',
          noCache: true,
          affix: true,
        },
      },
    ],
  },
  {
    path: '/nochild',
    component: Layout,
    meta: {
      title: 'nochild',
      noCache: true,
      affix: true,
      icon: 'List',
    },
    name: 'nochild',
  },
];

export const asyncRouter: AppRouteRecordRaw[] = [
  {
    path: '/workplace',
    component: Layout,
    redirect: '/workplace/workplace',
    name: 'workplaceH',
    meta: {
      title: 'workplaceH',
      icon: 'HomeFilled',
      alwaysShow: true,
    },
    children: [
      {
        path: 'workplace',
        component: () => import('@/views/home'),
        name: 'workplace',
        meta: {
          title: 'workplace',
          noCache: true,
          affix: true,
        },
      },
      {
        path: 'dashboard',
        component: () => import('@/views/home'),
        name: 'Wdashboard',
        meta: {
          title: 'Wdashboard',
          noCache: true,
        },
      },
    ],
  },
];
