import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isCollapsed: false,
  }),
  actions: {
    toggleCollapsed() {
      this.isCollapsed = !this.isCollapsed
    },
    setCollapsed(collapsed) {
      this.isCollapsed = collapsed
    },
  },
  persist: {
    key: 'layout-store',
    pick: ['isCollapsed'],
  },
})
