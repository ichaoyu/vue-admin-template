import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

// #region 静态路由

export const constantRoutes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500.vue'),
    meta: {
      title: '服务器错误',
    },
  },
  // 个人中心（嵌套在Layout下）
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: {
      title: '个人中心',
      requiresAuth: true,
    },
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          requiresAuth: true,
        },
      },
    ],
  },
  // 系统设置（嵌套在Layout下）
  {
    path: '/system/settings',
    component: Layout,
    redirect: '/system/settings/index',
    meta: {
      title: '系统设置',
      requiresAuth: true,
    },
    children: [
      {
        path: 'index',
        name: 'Settings',
        component: () => import('@/views/system/settings/index.vue'),
        meta: {
          title: '系统设置',
          requiresAuth: true,
        },
      },
    ],
  },
]

// #endregion

// #region 创建路由实例

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

// #endregion

// #region 动态路由管理

let isRoutesAdded = false

export const resetRouter = () => {
  isRoutesAdded = false
}

export const hasRoutesAdded = () => {
  return isRoutesAdded
}

export const markRoutesAdded = () => {
  isRoutesAdded = true
}

export const addDynamicRoutes = (routes) => {
  if (isRoutesAdded) return

  // 先添加动态路由
  routes.forEach((route) => {
    router.addRoute(route)
  })

  // 最后添加 404 路由作为兜底
  router.addRoute({
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  })

  isRoutesAdded = true
}

// #endregion

export default router
