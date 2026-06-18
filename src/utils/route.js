import Layout from '@/layout/index.vue'

// #region 模块导入映射

const modules = import.meta.glob('../views/**/*.vue')

const loadView = (component) => {
  if (!component) return null

  if (component === 'Layout' || component === 'DefaultLayout') {
    return Layout
  }

  // 1. 尝试直接匹配完整路径：cms/article/index.vue
  const fullPath = `../views/${component}.vue`
  if (modules[fullPath]) {
    return modules[fullPath]
  }

  // 2. 尝试查找以 component.vue 结尾的文件（兼容旧格式）
  const keys = Object.keys(modules)
  const matchedKey = keys.find((key) => key.endsWith(`${component}.vue`))
  return matchedKey ? modules[matchedKey] : null
}

// #endregion

// #region 菜单数据处理

export const filterVisibleMenus = (menus) => {
  if (!menus || !Array.isArray(menus)) return []

  return menus
    .filter((menu) => {
      // 过滤隐藏的菜单
      if (menu.meta?.hidden) return false
      // 过滤按钮类型的菜单（menuType=2 表示按钮，不应该显示在菜单中）
      if (menu.menuType === 2) return false
      return true
    })
    .map((menu) => {
      const filteredMenu = { ...menu }
      if (menu.children && menu.children.length > 0) {
        filteredMenu.children = filterVisibleMenus(menu.children)
      }
      return filteredMenu
    })
    .filter((menu) => {
      if (menu.children && menu.children.length === 0) {
        delete menu.children
      }
      return true
    })
}

export const getCachedRoutes = (menus) => {
  const cachedNames = []

  const traverse = (menuList) => {
    menuList.forEach((menu) => {
      if (!menu.meta?.noCache && menu.componentName) {
        cachedNames.push(menu.componentName)
      }
      if (menu.children && menu.children.length > 0) {
        traverse(menu.children)
      }
    })
  }

  traverse(menus)
  return cachedNames
}

// #endregion

// #region 路由生成

const LAYOUT_COMPONENTS = ['Layout', 'DefaultLayout']

export const generateRoutes = (menus) => {
  if (!menus || !Array.isArray(menus)) return []

  const routes = []

  menus.forEach((menu) => {
    const route = transformMenuToRoute(menu)
    if (route) {
      routes.push(route)
    }
  })

  return routes
}

const transformMenuToRoute = (menu) => {
  if (!menu) return null

  const isLayoutComponent = LAYOUT_COMPONENTS.includes(menu.component)

  if (isLayoutComponent) {
    const route = {
      path: menu.path,
      name: menu.key,
      component: Layout,
      meta: {
        title: menu.meta?.title || '',
        icon: menu.meta?.icon || '',
        hidden: menu.meta?.hidden || false,
        noCache: menu.meta?.noCache !== false,
      },
    }

    if (menu.redirect && menu.redirect !== menu.path && menu.redirect !== '') {
      route.redirect = menu.redirect
    }

    if (menu.children && menu.children.length > 0) {
      const childMap = new Map()
      menu.children.forEach((child) => {
        if (!childMap.has(child.path)) {
          childMap.set(child.path, child)
        }
      })

      route.children = Array.from(childMap.values())
        .map((child) => transformChildRoute(child))
        .filter((r) => r !== null)
    }

    return route
  } else {
    const route = {
      path: menu.path,
      component: Layout,
      meta: {
        title: menu.meta?.title || '',
        icon: menu.meta?.icon || '',
        hidden: menu.meta?.hidden || false,
        noCache: menu.meta?.noCache !== false,
      },
      children: [
        {
          path: '',
          name: menu.key,
          component: loadView(menu.component),
          meta: {
            title: menu.meta?.title || '',
            icon: menu.meta?.icon || '',
            hidden: menu.meta?.hidden || false,
            noCache: menu.meta?.noCache !== false,
          },
        },
      ],
    }

    return route
  }
}

const transformChildRoute = (menu) => {
  if (!menu) return null

  const route = {
    path: menu.path,
    name: menu.key || menu.componentName,
    component: loadView(menu.component),
    meta: {
      title: menu.meta?.title || '',
      icon: menu.meta?.icon || '',
      hidden: menu.meta?.hidden || false,
      noCache: menu.meta?.noCache !== false,
    },
  }

  if (menu.redirect && menu.redirect !== menu.path && menu.redirect !== '') {
    route.redirect = menu.redirect
  }

  if (menu.children && menu.children.length > 0) {
    const childMap = new Map()
    menu.children.forEach((child) => {
      if (!childMap.has(child.path)) {
        childMap.set(child.path, child)
      }
    })

    route.children = Array.from(childMap.values())
      .map((child) => transformChildRoute(child))
      .filter((r) => r !== null)
  }

  return route
}

// #endregion
