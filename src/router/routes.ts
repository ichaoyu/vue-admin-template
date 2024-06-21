import Layout from '@/layout/index.vue';

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
    redirect: '/home/dashboard',
    name: 'layout',
    meta: {
      hidden: true,
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
    },
  },
  {
    //403路由
    path: '/403',
    component: () => import('@/views/error/403.vue'),
    name: '403',
    meta: {
      hidden: true,
      title: '403',
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

export const asyncRouter: AppRouteRecordRaw[] = [
  {
    path: '/home',
    name: 'SystemHomeIndex',
    redirect: '/home/dashboard',
    component: Layout,
    meta: {
      title: '看板',
      icon: 'home',
      sort: 1,
      hidden: false,
      noCache: false,
      alwaysShow: false,
    },
    children: [
      {
        path: 'dashboard',
        name: 'home',
        component: () => import('@/views/demo'),
        meta: {
          title: '看板',
          sort: 1,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    redirect: '/system/user',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'setting',
      sort: 3,
      hidden: true,
      noCache: false,
      alwaysShow: true,
    },
    children: [
      {
        path: 'user',
        name: 'SystemUserIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '用户管理',
          sort: 1,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'role',
        name: 'SystemRoleIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '角色管理',
          sort: 2,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'menu',
        name: 'SystemMenuIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '菜单管理',
          sort: 3,
          hidden: true,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'dept',
        name: 'SystemDeptIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '部门管理',
          sort: 4,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'post',
        name: 'SystemPostIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '岗位管理',
          sort: 5,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'dictType',
        name: 'SystemDictTypeIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '字典管理',
          sort: 6,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'config',
        name: 'SystemConfigIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '参数配置',
          sort: 7,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'roleAuth/:id',
        name: 'SystemRoleAuthIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '分配用户',
          sort: 13,
          hidden: true,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'dictData/:id',
        name: 'SystemDictDataIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '字典数据',
          sort: 14,
          hidden: true,
          noCache: true,
          alwaysShow: false,
        },
      },
    ],
  },
  {
    path: '/monitor',
    name: '',
    redirect: '/monitor/loginLog',
    component: Layout,
    meta: {
      title: '系统监控',
      icon: 'watch',
      hidden: false,
    },
    children: [
      {
        path: 'loginLog',
        name: 'MonitorLoginLogIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '登录日志',
          sort: 7,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'online',
        name: 'MonitorOnlineIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '在线用户',
          sort: 8,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'operLog',
        name: 'MonitorOperLogIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '操作日志',
          sort: 9,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'cacheList',
        name: 'MonitorCacheListIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '缓存列表',
          sort: 12,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'server',
        name: 'MonitorServerIndex',
        component: () => import('@/views/demo'),
        meta: {
          title: '服务监控',
          sort: 13,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
    ],
  },
];
