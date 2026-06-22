import { defineStore } from 'pinia'
import { getUserInfoAPI } from '@/api/auth/auth'
import { resetRouter } from '@/router'
import { usePermissionStore } from '@/store/permission'
import { useDictStore } from '@/store/dict'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: '',
    roles: [],
    menus: [],
    permissions: [],
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      this.roles = userInfo.roles || []
    },
    setToken(token) {
      this.token = token
    },
    setRoles(roles) {
      this.roles = roles
    },
    setMenus(menus) {
      this.menus = menus
    },
    async getUserInfo() {
      const info = await getUserInfoAPI()
      this.userInfo = info.user || info
      this.roles = info.roles || []
      this.menus = info.menus || []
      this.permissions = info.permissions || []
      return info
    },
    logout() {
      this.userInfo = null
      this.token = ''
      this.roles = []
      this.menus = []
      this.permissions = []

      // 清理其他 store 的数据
      const permissionStore = usePermissionStore()
      permissionStore.cachedRoutes = []

      const dictStore = useDictStore()
      dictStore.clearDict()

      resetRouter()
    },
  },
  persist: {
    key: 'user-store',
    pick: ['token', 'roles', 'menus', 'permissions'],
  },
})
