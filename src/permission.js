import router, { addDynamicRoutes, hasRoutesAdded, resetRouter } from '@/router'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { useDictStore } from '@/store/dict'
import { generateRoutes, filterVisibleMenus, getCachedRoutes } from '@/utils/route'

// #region 白名单路由

const whiteList = ['/login', '/forgot-password', '/404', '/500']

// #endregion

// #region 初始化菜单和路由

const initMenuAndRoutes = (menus) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  const routes = generateRoutes(menus)
  const visibleMenus = filterVisibleMenus(menus)
  const cachedRoutes = getCachedRoutes(menus)

  permissionStore.setCachedRoutes(cachedRoutes)
  userStore.setMenus(visibleMenus)

  addDynamicRoutes(routes)
}

// #endregion

// #region 路由守卫

router.beforeEach(async (to) => {
  document.title = to.meta?.title ? `${to.meta.title} - Vue Admin` : 'Vue Admin'

  const userStore = useUserStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      return '/'
    }

    // 如果路由已经添加过，直接放行
    if (hasRoutesAdded()) {
      return true
    }

    try {
      const info = await userStore.getUserInfo()
      const menus = info.menus || info.menuList || []

      if (!menus || menus.length === 0) {
        return true
      }

      initMenuAndRoutes(menus)

      // 预加载常用字典数据
      const dictStore = useDictStore()
      dictStore.preloadCommonDicts()

      // 等待路由添加完成后再导航
      return { ...to, replace: true }
    } catch (error) {
      await userStore.logout()
      resetRouter()
      return `/login?redirect=${to.path}`
    }
  } else {
    if (whiteList.includes(to.path)) {
      return true
    }
    return `/login?redirect=${to.path}`
  }
})

router.afterEach(() => {})

// #endregion
