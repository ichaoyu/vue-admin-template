import { defineStore } from 'pinia'
import { getNotificationListAPI, markAsReadAPI, markAllAsReadAPI, getUnreadCountAPI } from '@/api/system/notification'
import { useWebSocket } from '@/utils/websocket'
import { useUserStore } from '@/store/user'

const WS_EVENTS = ['notification:new', 'notification:unread-count', '_reconnected']

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
    // #region HTTP 数据操作

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
      await markAsReadAPI({ id })
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
      this.unreadCount = 0
      await this.fetchNotifications()
    },

    // #endregion

    // #region WebSocket 通知操作

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
    },

    clearNewNotification() {
      this.newNotification = null
    },

    setWsConnected(connected) {
      this.wsConnected = connected
    },

    updateUnreadCount(count) {
      this.unreadCount = count
    },

    // #endregion

    // #region WebSocket 连接管理

    initWebSocket() {
      const userStore = useUserStore()
      if (!userStore.token) return

      const ws = useWebSocket()
      ws.clearHandlers(WS_EVENTS)

      ws.on('notification:new', (data) => {
        this.addNotification(data)
      })

      ws.on('notification:unread-count', (data) => {
        if (typeof data?.count === 'number') {
          this.updateUnreadCount(data.count)
        }
      })

      ws.on('_reconnected', () => {
        this.onWsReconnected()
      })

      ws.connect()
    },

    async onWsReconnected() {
      this.setWsConnected(true)
      try {
        await Promise.all([this.fetchUnreadCount(), this.fetchNotifications({ pageSize: 10 })])
      } catch (error) {
        console.error('[Notification] 重连后刷新数据失败:', error)
      }
    },

    disconnectWebSocket() {
      const ws = useWebSocket()
      ws.clearHandlers(WS_EVENTS)
      ws.disconnect()
      this.setWsConnected(false)
    },

    // #endregion

    async initNotifications() {
      const userStore = useUserStore()
      if (!userStore.token) {
        this.disconnectWebSocket()
        return
      }

      try {
        await this.fetchUnreadCount()
        await this.fetchNotifications({ pageSize: 10 })

        if (this.unreadCount > 0 && this.notifications.length > 0) {
          const latestUnread = this.notifications.find((n) => n.isRead === 0)
          if (latestUnread) {
            this.newNotification = latestUnread
          }
        }

        this.initWebSocket()
      } catch (error) {
        console.error('[Notification] 初始化通知数据失败:', error)
        this.initWebSocket()
      }
    },

    clearNotifications() {
      this.notifications = []
      this.unreadCount = 0
      this.total = 0
      this.newNotification = null
    },

    setPagination(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
    },
  },
})
