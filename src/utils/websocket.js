/**
 * WebSocket 客户端 composable
 * 提供自动连接、自动重连（指数退避）、心跳响应和连接状态管理
 */
import { ref, readonly } from 'vue'
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

/**
 * 计算重连延迟（指数退避 + 抖动）
 */
function getReconnectDelay() {
  const baseDelay = Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY)
  // 添加随机抖动（±20%）
  const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1)
  return Math.max(1000, baseDelay + jitter)
}

/**
 * 解析 WebSocket URL
 * 根据当前页面协议自动选择 ws/wss
 */
function getWebSocketUrl() {
  const userStore = useUserStore()
  const token = userStore.token

  if (!token) return null

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  // WebSocket 路径不含 API 前缀，直接连接到 /ws/notification
  return `${protocol}//${host}/ws/notification?token=${encodeURIComponent(token)}`
}

/**
 * 处理收到的消息
 */
function handleMessage(rawData) {
  try {
    const msg = JSON.parse(rawData)

    // 处理 ping 事件（心跳响应）
    if (msg.event === 'ping') {
      if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        wsInstance.send(JSON.stringify({ event: 'pong' }))
      }
      return
    }

    // 处理错误事件
    if (msg.event === 'error' && msg.data?.code === 401) {
      // Token 过期，断开连接并触发重连
      console.warn('[WebSocket] Token 过期，准备重连')
      cleanupConnection()
      connectionStatus.value = WS_STATUS.DISCONNECTED
      // 重连时使用新 token
      scheduleReconnect()
      return
    }

    // 分发事件给处理器
    if (msg.event && eventHandlers.has(msg.event)) {
      const handlers = eventHandlers.get(msg.event)
      handlers.forEach((handler) => handler(msg.data))
    }
  } catch (error) {
    console.error('[WebSocket] 消息解析失败:', error)
  }
}

/**
 * 清理连接
 */
function cleanupConnection() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  if (wsInstance) {
    // 移除事件监听避免重复触发
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

/**
 * 安排重连
 */
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

/**
 * 建立 WebSocket 连接
 */
function connect() {
  reconnectEnabled = true

  const url = getWebSocketUrl()
  if (!url) {
    reconnectEnabled = false
    connectionStatus.value = WS_STATUS.DISCONNECTED
    console.debug('[WebSocket] 无 token，跳过连接')
    return
  }

  reconnectEnabled = true

  // 如果已有连接，先关闭
  if (wsInstance) {
    cleanupConnection()
  }

  connectionStatus.value = WS_STATUS.CONNECTING

  try {
    wsInstance = new WebSocket(url)

    wsInstance.onopen = () => {
      console.log('[WebSocket] 连接成功')
      connectionStatus.value = WS_STATUS.CONNECTED
      reconnectAttempts = 0

      // 通知所有处理器连接已恢复
      if (eventHandlers.has('_reconnected')) {
        const handlers = eventHandlers.get('_reconnected')
        handlers.forEach((handler) => handler())
      }
    }

    wsInstance.onclose = (event) => {
      console.log(`[WebSocket] 连接关闭: code=${event.code}, reason=${event.reason}`)
      if (connectionStatus.value !== WS_STATUS.DISCONNECTED) {
        // 非主动断开，尝试重连
        cleanupConnection()
        scheduleReconnect()
      }
    }

    wsInstance.onerror = (error) => {
      console.error('[WebSocket] 连接错误:', error)
      // onclose 会自动触发，无需额外处理
    }

    wsInstance.onmessage = (event) => {
      handleMessage(event.data)
    }
  } catch (error) {
    console.error('[WebSocket] 创建连接失败:', error)
    scheduleReconnect()
  }
}

/**
 * 断开 WebSocket 连接
 */
function disconnect() {
  reconnectEnabled = false
  connectionStatus.value = WS_STATUS.DISCONNECTED
  cleanupConnection()
  reconnectAttempts = 0
  console.log('[WebSocket] 已主动断开连接')
}

/**
 * 注册事件监听
 * @param {string} event 事件名称
 * @param {Function} handler 处理函数
 */
function on(event, handler) {
  if (!eventHandlers.has(event)) {
    eventHandlers.set(event, new Set())
  }
  eventHandlers.get(event).add(handler)
}

/**
 * 移除事件监听
 * @param {string} event 事件名称
 * @param {Function} handler 处理函数
 */
function off(event, handler) {
  if (eventHandlers.has(event)) {
    if (handler) {
      eventHandlers.get(event).delete(handler)
    } else {
      eventHandlers.delete(event)
    }
  }
}

/**
 * WebSocket composable
 * @returns {Object} WebSocket 控制方法和状态
 */
export function useWebSocket() {
  return {
    /** 连接状态（只读） */
    status: readonly(connectionStatus),

    /** 是否已连接 */
    isConnected: () => connectionStatus.value === WS_STATUS.CONNECTED,

    /** 建立连接 */
    connect,

    /** 断开连接 */
    disconnect,

    /** 注册事件监听 */
    on,

    /** 移除事件监听 */
    off,
  }
}
