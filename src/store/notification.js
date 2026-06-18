import { defineStore } from 'pinia'
import { getNotificationListAPI, markAsReadAPI, markAllAsReadAPI, getUnreadCountAPI } from '@/api/system/notification'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false,
    wsConnected: false,
    newNotification: null,
  }),

  getters: {
    getNotifications: (state) => state.notifications,
    getUnreadCount: (state) => state.unreadCount,
    isLoading: (state) => state.loading,
    isWsConnected: (state) => state.wsConnected,
    getUnreadNotifications: (state) => state.notifications.filter((item) => item.isRead === 0),
    getTotal: (state) => state.total,
    getPagination: (state) => ({
      page: state.page,
      pageSize: state.pageSize,
      total: state.total,
    }),
  },

  actions: {
    async fetchNotifications(params = {}) {
      this.loading = true
      try {
        const response = await getNotificationListAPI({
          page: params.page || this.page,
          pageSize: params.pageSize || this.pageSize,
          isRead: params.isRead,
        })
        this.notifications = response.list || []
        this.total = response.total || 0
        this.page = response.page || 1
        this.pageSize = response.pageSize || 20
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await getUnreadCountAPI()
        this.unreadCount = response || 0
      } catch (error) {
        throw error
      }
    },

    async markAsRead(id) {
      await markAsReadAPI(id)
      const notification = this.notifications.find((n) => n.id === id)
      if (notification) {
        notification.isRead = 1
      }
      await this.fetchUnreadCount()
    },

    async markAllAsRead() {
      await markAllAsReadAPI()
      this.notifications.forEach((notification) => {
        notification.isRead = 1
      })
      await this.fetchUnreadCount()
      await this.fetchNotifications()
    },

    addNotification(notification) {
      if (!notification.id || !notification.title) return
      const exists = this.notifications.some((n) => n.id === notification.id)
      if (!exists) {
        this.notifications.unshift({
          ...notification,
          isRead: 0,
        })
        this.total++
        this.newNotification = notification
      }
      this.fetchUnreadCount()
    },

    clearNewNotification() {
      this.newNotification = null
    },

    setWsConnected(connected) {
      this.wsConnected = connected
    },

    clearNotifications() {
      this.notifications = []
      this.unreadCount = 0
      this.total = 0
    },

    setPagination(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
    },
  },
})
