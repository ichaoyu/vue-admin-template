import dayjs from 'dayjs'

// #region 日期格式化

/**
 * 格式化日期
 * @param {string|Date|number} date - 日期
 * @param {string} format - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 格式化日期时间
 * @param {string|Date|number} date - 日期
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化日期
 * @param {string|Date|number} date - 日期
 * @returns {string} 格式化后的日期字符串
 */
export const formatDateOnly = (date) => {
  return formatDate(date, 'YYYY-MM-DD')
}

/**
 * 格式化时间
 * @param {string|Date|number} date - 日期
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (date) => {
  return formatDate(date, 'HH:mm:ss')
}

// #endregion

// #region 相对时间

/**
 * 获取相对时间描述
 * @param {string|Date|number} date - 日期
 * @returns {string} 相对时间描述
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''

  const now = dayjs()
  const target = dayjs(date)
  const diff = now.diff(target, 'second')

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)} 分钟前`
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)} 小时前`
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)} 天前`
  } else {
    return formatDate(date)
  }
}

// #endregion

export default dayjs
