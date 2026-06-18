import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    cachedRoutes: [],
  }),
  actions: {
    setCachedRoutes(routes) {
      this.cachedRoutes = routes
    },
  },
})
