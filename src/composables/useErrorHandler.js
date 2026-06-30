import { ElMessage } from 'element-plus'

export function useErrorHandler() {
  const handleApiError = (error, context = 'API') => {
    const message = error?.response?.data?.message || error?.message || '操作失败，请稍后重试'

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error(`[${context}]`, error)
    }

    ElMessage.error(message)
  }

  return { handleApiError }
}

export default useErrorHandler
