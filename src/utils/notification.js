const typeMap = {
  system: 'primary',
  announcement: 'success',
  reminder: 'warning',
  notice: 'info',
}

const labelMap = {
  system: '系统',
  announcement: '公告',
  reminder: '提醒',
  notice: '通知',
}

export function getNotificationType(type) {
  return typeMap[type] || 'info'
}

export function getNotificationLabel(type) {
  return labelMap[type] || '通知'
}

export function truncateContent(content, maxLength = 100) {
  if (!content) return ''
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength) + '...'
}
