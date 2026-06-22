import Layout from '@/layout/index.vue'

// #region 模块导入映射

const modules = import.meta.glob('../views/**/*.vue')

const loadView = (component) => {
  if (!component) return null

  if (component === 'Layout' || component === 'DefaultLayout' || component === 'ParentLayout') {
    return Layout
  }

  const keys = Object.keys(modules)

  // 1. 精确匹配：system/user -> ../views/system/user.vue
  const fullPath = `../views/${component}.vue`
  if (modules[fullPath]) {
    return modules[fullPath]
  }

  // 2. 兜底：查找以 component 任意段落结尾的文件
  const segments = component.split('/')
  for (let i = segments.length - 1; i >= 0; i--) {
    const tail = segments.slice(i).join('/')
    const matched = keys.find((key) => key.endsWith(`${tail}.vue`))
    if (matched) {
      console.warn(`[Route] 组件 "${component}" 使用模糊匹配: ${matched}`)
      return modules[matched]
    }
  }

  console.warn(`[Route] 未找到组件: "${component}"，请检查菜单配置或文件是否存在`)
  return null
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
    const viewComponent = loadView(menu.component)
    if (!viewComponent) {
      console.warn(`[Route] 跳过无法解析的路由: path="${menu.path}", component="${menu.component}"`)
      return null
    }

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
          component: viewComponent,
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

  const viewComponent = loadView(menu.component)
  if (!viewComponent) {
    console.warn(`[Route] 跳过无法解析的子路由: path="${menu.path}", component="${menu.component}"`)
    return null
  }

  const route = {
    path: menu.path,
    name: menu.key || menu.componentName,
    component: viewComponent,
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
