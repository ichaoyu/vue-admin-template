import Mock from 'mockjs';
const toAnyString = () => {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(
    /[xy]/g,
    (c: string) => {
      const r: number = (Math.random() * 16) | 0;
      const v: number = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString();
    },
  );
  return str;
};
const SUCCESS_CODE = 200;

const timeout = 1000;

const adminList = [
  {
    path: '/home',
    name: 'SystemHomeIndex',
    redirect: '/home/dashboard',
    component: '#',
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
        component: 'views/demo/demo',
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
    component: '#',
    meta: {
      title: '系统管理',
      icon: 'setting',
      sort: 3,
      hidden: false,
      noCache: false,
      alwaysShow: true,
    },
    children: [
      {
        path: 'user',
        name: 'SystemUserIndex',
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
        meta: {
          title: '菜单管理',
          sort: 3,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'dept',
        name: 'SystemDeptIndex',
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
    component: '#',
    meta: {
      title: '系统监控',
      icon: 'watch',
      sort: 2,
      hidden: false,
      noCache: false,
      alwaysShow: true,
    },
    children: [
      {
        path: 'loginLog',
        name: 'MonitorLoginLogIndex',
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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

const testList: string[] = [
  '/dashboard',
  '/dashboard/analysis',
  '/dashboard/workplace',
  'external-link',
  'https://element-plus-admin-doc.cn/',
  '/guide',
  '/guide/index',
  '/components',
  '/components/form',
  '/components/form/default-form',
  '/components/form/use-form',
  '/components/form/ref-form',
  '/components/table',
  '/components/table/default-table',
  '/components/table/use-table',
  '/components/table/tree-table',
  '/components/table/table-image-preview',
  '/components/table/table-video-preview',
  '/components/table/ref-table',
  '/components/table/card-table',
  '/components/editor-demo',
  '/components/editor-demo/editor',
  '/components/editor-demo/json-editor',
  '/components/editor-demo/code-editor',
  '/components/search',
  '/components/descriptions',
  '/components/image-viewer',
  '/components/dialog',
  '/components/icon',
  '/components/iconPicker',
  '/components/echart',
  '/components/count-to',
  '/components/qrcode',
  '/components/highlight',
  '/components/infotip',
  '/components/input-password',
  '/components/waterfall',
  '/components/image-cropping',
  '/components/video-player',
  '/components/avatars',
  '/components/i-agree',
  'function',
  '/function/multiple-tabs',
  '/function/multiple-tabs-demo/:id',
  '/function/request',
  '/function/test',
  '/hooks',
  '/hooks/useWatermark',
  '/hooks/useTagsView',
  '/hooks/useValidator',
  '/hooks/useCrudSchemas',
  '/hooks/useClipboard',
  '/hooks/useNetwork',
  '/level',
  '/level/menu1',
  '/level/menu1/menu1-1',
  '/level/menu1/menu1-1/menu1-1-1',
  '/level/menu1/menu1-2',
  '/level/menu2',
  '/example',
  '/example/example-dialog',
  '/example/example-page',
  '/example/example-add',
  '/example/example-edit',
  '/example/example-detail',
  '/authorization',
  '/authorization/department',
  '/authorization/user',
  '/authorization/role',
  '/authorization/menu',
  '/error',
  '/error/404-demo',
  '/error/403-demo',
  '/error/500-demo',
];

const List: any[] = [];

const roleNames = ['超级管理员', '管理员', '普通用户', '游客'];
const menus = [
  {
    path: '/home',
    name: 'SystemHomeIndex',
    redirect: '/home/dashboard',
    component: '#',
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
        component: 'views/demo/demo',
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
    component: '#',
    meta: {
      title: '系统管理',
      icon: 'setting',
      sort: 3,
      hidden: false,
      noCache: false,
      alwaysShow: true,
    },
    children: [
      {
        path: 'user',
        name: 'SystemUserIndex',
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
        meta: {
          title: '菜单管理',
          sort: 3,
          hidden: false,
          noCache: true,
          alwaysShow: false,
        },
      },
      {
        path: 'dept',
        name: 'SystemDeptIndex',
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
    component: '#',
    meta: {
      title: '系统监控',
      icon: 'watch',
      sort: 2,
      hidden: false,
      noCache: false,
      alwaysShow: true,
    },
    children: [
      {
        path: 'loginLog',
        name: 'MonitorLoginLogIndex',
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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
        component: 'views/demo/demo',
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

for (let i = 0; i < 4; i++) {
  List.push(
    Mock.mock({
      id: toAnyString(),
      // timestamp: +Mock.Random.date('T'),
      roleName: roleNames[i],
      role: '@first',
      status: Mock.Random.integer(0, 1),
      createTime: '@datetime',
      remark: '@cword(10, 15)',
      menu: menus[i],
    }),
  );
}

export default [
  // 列表接口
  {
    url: '/api/mock/role/list',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: adminList,
      };
    },
  },
  {
    url: '/api/mock/role/table',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: List,
          total: 4,
        },
      };
    },
  },
  // 列表接口
  {
    url: '/api/mock/role/list2',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: testList,
      };
    },
  },
  {
    url: '/api/mock/role/table',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: List,
          total: 4,
        },
      };
    },
  },
];
