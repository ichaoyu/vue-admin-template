import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'

// #region 创建axios实例

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// #endregion

// #region 错误消息去重机制

// 已显示的错误消息集合
const shownMessages = new Set()
// 401确认框是否正在显示
let isUnauthorizedDialogShowing = false

/**
 * 显示错误消息（去重）
 * @param {string} message - 错误消息
 * @param {number} duration - 显示时长
 */
const showErrorMessage = (message, duration = 3000) => {
  if (shownMessages.has(message)) return

  shownMessages.add(message)
  ElMessage.error({
    message,
    duration,
    onClose: () => {
      shownMessages.delete(message)
    },
  })
}

// #endregion

// #region 请求拦截器

api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// #endregion

// #region 响应拦截器

/**
 * 处理业务错误
 * @param {Object} error - 错误对象
 * @param {string} message - 错误消息
 * @returns {Promise<never>}
 */
const handleBusinessError = (error, message) => {
  showErrorMessage(message)
  return Promise.reject(error)
}

/**
 * 处理HTTP错误
 * @param {Object} error - 错误对象
 * @returns {Promise<never>}
 */
const handleHttpError = (error) => {
  if (!error.response) {
    showErrorMessage('网络连接异常，请检查网络')
    return Promise.reject(error)
  }

  const { status, data } = error.response
  // 优先使用业务返回的message，否则使用默认HTTP错误消息
  const message = data?.message || getHttpErrorMessage(status)

  // 401特殊处理：弹出确认框（只弹一次）
  if (status === 401) {
    handleUnauthorized()
    return Promise.reject(error)
  }

  // 其他错误：显示错误消息（去重）
  showErrorMessage(message)
  return Promise.reject(error)
}

/**
 * 获取HTTP错误消息
 * @param {number} status - HTTP状态码
 * @returns {string} 错误消息
 */
const getHttpErrorMessage = (status) => {
  const messages = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求的资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    500: '服务器内部错误',
    501: '服务未实现',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
    505: 'HTTP版本不受支持',
  }
  return messages[status] || `请求失败 (${status})`
}

/**
 * 处理401未授权（只弹一次确认框）
 */
const handleUnauthorized = () => {
  // 如果已经在显示确认框，则不再弹出
  if (isUnauthorizedDialogShowing) return

  isUnauthorizedDialogShowing = true

  ElMessageBox.confirm('登录状态已过期，请重新登录', '提示', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning',
    closeOnClickModal: false,
  })
    .then(() => {
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    })
    .catch(() => {
      // 用户点击取消，不做处理
    })
    .finally(() => {
      isUnauthorizedDialogShowing = false
    })
}

api.interceptors.response.use(
  (response) => {
    const { status, data: res } = response

    // HTTP状态码 2xx 都是成功（200, 201, 202, 204等）
    if (status >= 200 && status < 300) {
      // 业务code为200，返回data
      if (res.code === 200) {
        return res.data
      }
      // 业务code非200，处理业务错误
      return handleBusinessError(new Error(res.message), res.message || '操作失败')
    }

    // HTTP状态码非2xx，处理业务错误
    return handleBusinessError(new Error(res.message), res.message || '请求失败')
  },
  (error) => {
    // 处理HTTP错误（4xx, 5xx）
    return handleHttpError(error)
  }
)

// #endregion

export default api
