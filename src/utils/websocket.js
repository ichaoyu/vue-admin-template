import { readonly, ref } from 'vue'
import { useUserStore } from '@/store/user'

/** 连接状态枚举 */
export const WS_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
}

/** WebSocket 单例实例 */
let wsInstance = null

/** 重连相关状态 */
let reconnectTimer = null
let reconnectAttempts = 0
let reconnectEnabled = true
const MAX_RECONNECT_ATTEMPTS = 50
const INITIAL_RECONNECT_DELAY = 1000
const MAX_RECONNECT_DELAY = 30000

/** 事件处理器映射 */
const eventHandlers = new Map()

/** 连接状态 */
const connectionStatus = ref(WS_STATUS.DISCONNECTED)

// #region URL 和重连

function getReconnectDelay() {
  const baseDelay = Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY)
  const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1)
  return Math.max(1000, baseDelay + jitter)
}

function getAuthToken() {
  const userStore = useUserStore()
  return userStore.token || null
}

function getWebSocketUrl() {
  if (!getAuthToken()) return null

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  return `${protocol}//${host}/ws/notification`
}

function scheduleReconnect() {
  const userStore = useUserStore()
  if (!reconnectEnabled || !userStore.token) {
    connectionStatus.value = WS_STATUS.DISCONNECTED
    return
  }

  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.warn('[WebSocket] 达到最大重连次数，停止重连')
    connectionStatus.value = WS_STATUS.DISCONNECTED
    return
  }

  connectionStatus.value = WS_STATUS.RECONNECTING
  reconnectAttempts++

  const delay = getReconnectDelay()
  console.log(`[WebSocket] 将在 ${Math.round(delay / 1000)}s 后重连 (第 ${reconnectAttempts} 次)`)

  reconnectTimer = setTimeout(() => {
    connect()
  }, delay)
}

// #endregion

// #region 消息处理

function emit(event, data) {
  if (!eventHandlers.has(event)) return
  const handlers = eventHandlers.get(event)
  handlers.forEach((handler) => handler(data))
}

function handleMessage(rawData) {
  try {
    const msg = JSON.parse(rawData)

    if (msg.event === 'auth:success') {
      connectionStatus.value = WS_STATUS.CONNECTED
      reconnectAttempts = 0
      emit('_reconnected')
      return
    }

    if (msg.event === 'ping') {
      if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        wsInstance.send(JSON.stringify({ event: 'pong' }))
      }
      return
    }

    if (msg.event === 'error' && msg.data?.code === 401) {
      console.warn('[WebSocket] Token 过期或会话失效，准备重连')
      cleanupConnection()
      connectionStatus.value = WS_STATUS.DISCONNECTED
      scheduleReconnect()
      return
    }

    if (msg.event) {
      emit(msg.event, msg.data)
    }
  } catch (error) {
    console.error('[WebSocket] 消息解析失败:', error)
  }
}

// #endregion

// #region 连接管理

function cleanupConnection() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  if (wsInstance) {
    wsInstance.onopen = null
    wsInstance.onclose = null
    wsInstance.onerror = null
    wsInstance.onmessage = null

    if (wsInstance.readyState === WebSocket.OPEN || wsInstance.readyState === WebSocket.CONNECTING) {
      wsInstance.close(1000, 'Client disconnect')
    }
    wsInstance = null
  }
}

function connect() {
  const url = getWebSocketUrl()
  if (!url) {
    reconnectEnabled = false
    connectionStatus.value = WS_STATUS.DISCONNECTED
    console.debug('[WebSocket] 无 token，跳过连接')
    return
  }

  reconnectEnabled = true

  if (wsInstance) {
    cleanupConnection()
  }

  connectionStatus.value = WS_STATUS.CONNECTING

  try {
    wsInstance = new WebSocket(url)

    wsInstance.onopen = () => {
      const token = getAuthToken()
      if (!token) {
        console.warn('[WebSocket] 无 token，关闭连接')
        disconnect()
        return
      }

      wsInstance.send(JSON.stringify({ event: 'auth', data: { token } }))
      console.log('[WebSocket] 连接成功，已发送认证消息')
    }

    wsInstance.onclose = (event) => {
      console.log(`[WebSocket] 连接关闭: code=${event.code}, reason=${event.reason}`)
      wsInstance = null
      if (reconnectEnabled && connectionStatus.value !== WS_STATUS.DISCONNECTED) {
        scheduleReconnect()
      }
    }

    wsInstance.onerror = (error) => {
      console.error('[WebSocket] 连接错误:', error)
    }

    wsInstance.onmessage = (event) => {
      handleMessage(event.data)
    }
  } catch (error) {
    console.error('[WebSocket] 创建连接失败:', error)
    scheduleReconnect()
  }
}

function disconnect() {
  reconnectEnabled = false
  connectionStatus.value = WS_STATUS.DISCONNECTED
  cleanupConnection()
  reconnectAttempts = 0
  console.log('[WebSocket] 已主动断开连接')
}

function clearHandlers(events = []) {
  if (!events.length) {
    eventHandlers.clear()
    return
  }

  events.forEach((event) => eventHandlers.delete(event))
}

// #endregion

// #region 事件监听

function on(event, handler) {
  if (!eventHandlers.has(event)) {
    eventHandlers.set(event, new Set())
  }
  eventHandlers.get(event).add(handler)
}

function off(event, handler) {
  if (eventHandlers.has(event)) {
    if (handler) {
      eventHandlers.get(event).delete(handler)
    } else {
      eventHandlers.delete(event)
    }
  }
}

// #endregion

export function useWebSocket() {
  return {
    status: readonly(connectionStatus),
    isConnected: () => connectionStatus.value === WS_STATUS.CONNECTED,
    connect,
    disconnect,
    on,
    off,
    clearHandlers,
  }
}
