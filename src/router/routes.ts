import Layout from '@/layout/index.vue';
import type { AppRouteRecordRaw } from '@/types';

// 常量路由配置
export const constantRoute: AppRouteRecordRaw[] = [
  {
    // 登录路由
    path: '/login',
    component: () => import('@/views/login'),
    name: 'Login',
    meta: {
      hidden: true,
      title: '登录',
      noTagsView: true,
    },
  },
  {
    // 根路由
    path: '/',
    component: Layout,
    redirect: '/home/dashboard',
    name: 'Root',
    meta: {
      hidden: true,
      title: '',
    },
  },
  {
    // 404路由
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    name: 'NotFound',
    meta: {
      hidden: true,
      title: '404',
    },
  },
  {
    // 403路由
    path: '/403',
    component: () => import('@/views/error/403.vue'),
    name: 'Forbidden',
    meta: {
      hidden: true,
      title: '403',
    },
  },
  {
    // 任意路由，重定向到404页面
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'AnyRoute',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true,
    },
  },
];

// 异步路由配置
export const asyncRouter: AppRouteRecordRaw[] = [
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/dashboard',
    component: Layout,
    meta: {
      title: '看板',
      icon: 'home',
      sort: 1,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/demo'),
        meta: {
          title: '看板',
          sort: 1,
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/cms',
    name: 'Cms',
    redirect: '/cms/article',
    component: Layout,
    meta: {
      title: 'CMS管理',
      icon: 'site',
      sort: 2,
      alwaysShow: true,
    },
    children: [
      {
        path: 'article',
        name: 'CmsArticle',
        component: () => import('@/views/site/article'),
        meta: {
          title: '文章管理',
          sort: 1,
        },
      },
      {
        path: 'category',
        name: 'CmsCategory',
        component: () => import('@/views/demo'),
        meta: {
          title: '分类管理',
          sort: 2,
        },
      },
      {
        path: 'tag',
        name: 'CmsTag',
        component: () => import('@/views/site/tag'),
        meta: {
          title: '标签管理',
          sort: 3,
        },
      },
      {
        path: 'friendlink',
        name: 'CmsFriendlink',
        component: () => import('@/views/site/flink'),
        meta: {
          title: '友情链接',
          sort: 4,
        },
      },
      {
        path: 'message',
        name: 'CmsMessage',
        component: () => import('@/views/site/message'),
        meta: {
          title: '消息管理',
          sort: 5,
        },
      },
      {
        path: 'site',
        name: 'CmsSite',
        component: () => import('@/views/site/config'),
        meta: {
          title: '站点设置',
          sort: 6,
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'setting',
      sort: 3,
      alwaysShow: true,
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user'),
        meta: {
          title: '用户管理',
          sort: 1,
          noCache: true,
        },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/demo'),
        meta: {
          title: '角色管理',
          sort: 2,
          noCache: true,
        },
      },
      {
        path: 'menu',
        name: 'SystemMenu',
        component: () => import('@/views/demo'),
        meta: {
          title: '菜单管理',
          sort: 3,
          hidden: true,
          noCache: true,
        },
      },
      {
        path: 'dept',
        name: 'SystemDept',
        component: () => import('@/views/demo'),
        meta: {
          title: '部门管理',
          sort: 4,
          noCache: true,
        },
      },
      {
        path: 'post',
        name: 'SystemPost',
        component: () => import('@/views/demo'),
        meta: {
          title: '岗位管理',
          sort: 5,
          noCache: true,
        },
      },
      {
        path: 'dictType',
        name: 'SystemDictType',
        component: () => import('@/views/system/dict'),
        meta: {
          title: '字典管理',
          sort: 6,
          noCache: true,
        },
      },
      {
        path: 'dictData/:id',
        name: 'SystemDictData',
        component: () => import('@/views/system/dict/dict-data.vue'),
        meta: {
          title: '字典数据',
          sort: 7,
          hidden: true,
          noCache: true,
        },
      },
      {
        path: 'config',
        name: 'SystemConfig',
        component: () => import('@/views/system/config'),
        meta: {
          title: '参数配置',
          sort: 8,
          noCache: true,
        },
      },
      {
        path: 'roleAuth/:id',
        name: 'SystemRoleAuth',
        component: () => import('@/views/demo'),
        meta: {
          title: '分配用户',
          sort: 9,
          hidden: true,
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/monitor',
    name: 'Monitor',
    redirect: '/monitor/loginLog',
    component: Layout,
    meta: {
      title: '系统监控',
      icon: 'watch',
      sort: 4,
    },
    children: [
      {
        path: 'loginLog',
        name: 'MonitorLoginLog',
        component: () => import('@/views/monitor/login-log'),
        meta: {
          title: '登录日志',
          sort: 1,
          noCache: true,
        },
      },
      {
        path: 'online',
        name: 'MonitorOnline',
        component: () => import('@/views/monitor/online'),
        meta: {
          title: '在线用户',
          sort: 2,
          noCache: true,
        },
      },
      {
        path: 'operLog',
        name: 'MonitorOperLog',
        component: () => import('@/views/monitor/oper-log'),
        meta: {
          title: '操作日志',
          sort: 3,
          noCache: true,
        },
      },
      {
        path: 'cacheList',
        name: 'MonitorCacheList',
        component: () => import('@/views/monitor/cache-list'),
        meta: {
          title: '缓存列表',
          sort: 4,
          noCache: true,
        },
      },
      {
        path: 'server',
        name: 'MonitorServer',
        component: () => import('@/views/monitor/server'),
        meta: {
          title: '服务监控',
          sort: 5,
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/personal',
    name: 'Personal',
    redirect: '/personal/center',
    component: Layout,
    meta: {
      title: '个人中心',
      hidden: true,
      sort: 5,
    },
    children: [
      {
        path: 'center',
        name: 'PersonalCenter',
        component: () => import('@/views/demo'),
        meta: {
          title: '个人中心',
          hidden: true,
        },
      },
    ],
  },
];
