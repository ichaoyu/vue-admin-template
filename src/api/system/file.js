import api from '@/utils/axios'

// #region 文件管理接口

/**
 * 上传文件
 * @param {FormData} formData - 文件数据
 * @returns {Promise<Object>} 返回上传结果
 */
export const uploadFileAPI = (formData) =>
  api.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

/**
 * 获取文件信息
 * @param {string} id - 文件ID
 * @returns {Promise<Object>} 返回文件信息
 */
export const getFileInfoAPI = (id) => api.get(`/file/${id}`)

/**
 * 删除文件
 * @param {string} id - 文件ID
 * @returns {Promise<void>}
 */
export const deleteFileAPI = (id) => api.delete(`/file/${id}`)

// #endregion
