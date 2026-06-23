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
    component: () => import('@/views/login.vue'),
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
        component: () => import('@/views/profile.vue'),
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
        component: () => import('@/views/system/settings.vue'),
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

/** 记录动态添加的路由名称，用于登出时清除 */
const dynamicRouteNames = []

export const resetRouter = () => {
  // 清除所有动态添加的路由
  dynamicRouteNames.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
  dynamicRouteNames.length = 0
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
    // 记录路由名称（用于后续清除）
    if (route.name) {
      dynamicRouteNames.push(route.name)
    }
    // 子路由也需要记录
    if (route.children) {
      route.children.forEach((child) => {
        if (child.name) {
          dynamicRouteNames.push(child.name)
        }
      })
    }
  })

  // 最后添加 404 路由作为兜底
  const catchAllName = '__catch_all_404__'
  router.addRoute({
    name: catchAllName,
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  })
  dynamicRouteNames.push(catchAllName)

  isRoutesAdded = true
}

// #endregion

export default router
