import { defineStore } from 'pinia'
import { getNotificationListAPI, markAsReadAPI, markAllAsReadAPI, getUnreadCountAPI } from '@/api/system/notification'
import { useWebSocket, WS_STATUS } from '@/utils/websocket'
import { useUserStore } from '@/store/user'

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
      // WebSocket 会推送未读计数更新，无需手动 fetchUnreadCount
      // 但作为降级方案，仍保留 HTTP 刷新
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

    /**
     * 更新未读计数（由 WebSocket 推送触发）
     */
    updateUnreadCount(count) {
      this.unreadCount = count
    },

    // #endregion

    // #region WebSocket 连接管理

    /**
     * 初始化 WebSocket 连接并绑定事件
     */
    initWebSocket() {
      const userStore = useUserStore()
      if (!userStore.token) return

      const ws = useWebSocket()

      // 监听新通知推送
      ws.on('notification:new', (data) => {
        this.addNotification(data)
      })

      // 监听未读计数推送
      ws.on('notification:unread-count', (data) => {
        if (typeof data.count === 'number') {
          this.updateUnreadCount(data.count)
        }
      })

      // 监听重连成功事件，刷新数据
      ws.on('_reconnected', () => {
        this.onWsReconnected()
      })

      // 建立连接
      ws.connect()
    },

    /**
     * WebSocket 重连成功后，重新拉取数据确保一致
     */
    async onWsReconnected() {
      this.setWsConnected(true)
      try {
        await Promise.all([this.fetchUnreadCount(), this.fetchNotifications({ pageSize: 10 })])
      } catch (error) {
        console.error('[Notification] 重连后刷新数据失败:', error)
      }
    },

    /**
     * 断开 WebSocket 连接
     */
    disconnectWebSocket() {
      const ws = useWebSocket()
      ws.disconnect()
      this.setWsConnected(false)
    },

    // #endregion

    /**
     * 初始化通知数据（登录后调用）
     * 加载未读计数和最近通知，如果有未读通知则触发弹窗
     */
    async initNotifications() {
      const userStore = useUserStore()
      if (!userStore.token) {
        this.disconnectWebSocket()
        return
      }

      try {
        // 先加载未读计数
        await this.fetchUnreadCount()

        // 加载最近通知
        await this.fetchNotifications({ pageSize: 10 })

        // 如果有未读通知，将最新的一条设为 newNotification 以触发弹窗
        if (this.unreadCount > 0 && this.notifications.length > 0) {
          const latestUnread = this.notifications.find((n) => n.isRead === 0)
          if (latestUnread) {
            this.newNotification = latestUnread
          }
        }

        // 初始化 WebSocket 连接
        this.initWebSocket()
      } catch (error) {
        console.error('[Notification] 初始化通知数据失败:', error)
        // 即使失败也要尝试建立 WebSocket 连接
        this.initWebSocket()
      }
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
