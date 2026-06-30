<template>
  <div class="file-container">
    <!-- #region 上传区域 -->
    <el-card class="upload-card" shadow="hover">
      <template #header>
        <span>文件上传</span>
      </template>
      <el-upload
        ref="uploadRef"
        class="upload-area"
        drag
        :action="uploadUrl"
        :headers="uploadHeaders"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        :show-file-list="false"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">支持上传图片、文档、压缩包、音视频文件，单个文件大小不超过 10MB</div>
        </template>
      </el-upload>
    </el-card>
    <!-- #endregion -->

    <!-- #region 文件列表 -->
    <el-card class="file-list-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>文件列表</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文件名"
            clearable
            :prefix-icon="Search"
            style="width: 200px"
            @input="handleSearch"
          />
        </div>
      </template>
      <el-table v-loading="loading" :data="fileList" border stripe style="width: 100%">
        <el-table-column label="预览" width="80" align="center">
          <template #default="{ row }">
            <el-image
              v-if="isImage(row.mimeType)"
              :src="row.url"
              :preview-src-list="[row.url]"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 4px"
            />
            <el-icon v-else :size="40" color="#909399">
              <component :is="getFileIcon(row.mimeType)" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="originalName" label="文件名" min-width="200" show-overflow-tooltip />
        <el-table-column prop="mimeType" label="文件类型" width="120" />
        <el-table-column label="文件大小" width="120" align="center">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link :icon="View" @click="handleView(row)"> 查看 </el-button>
            <el-button type="danger" size="small" link :icon="Delete" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    <!-- #endregion -->

    <!-- #region 文件详情对话框 -->
    <el-dialog v-model="detailVisible" title="文件详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="文件名">{{ currentFile.originalName }}</el-descriptions-item>
        <el-descriptions-item label="文件类型">{{ currentFile.mimeType }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{ formatFileSize(currentFile.size) }}</el-descriptions-item>
        <el-descriptions-item label="文件路径">
          <el-link :href="currentFile.url" target="_blank" type="primary">
            {{ currentFile.url }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="上传时间">{{ formatDateTime(currentFile.createTime) }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="isImage(currentFile.mimeType)" class="preview-image">
        <el-image :src="currentFile.url" fit="contain" style="width: 100%; max-height: 400px" />
      </div>
    </el-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { useErrorHandler } from '@/composables/useErrorHandler'
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UploadFilled,
  Search,
  View,
  Delete,
  Document,
  Picture,
  VideoCamera,
  Headset,
  Folder,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { getFileListAPI, getFileInfoAPI, deleteFileAPI } from '@/api/system/file'
import { formatDateTime } from '@/utils/date'

const { handleApiError } = useErrorHandler()

defineOptions({
  name: 'SystemFileIndex',
})

// #region 数据定义

const uploadRef = ref(null)
const loading = ref(false)
const searchKeyword = ref('')
const detailVisible = ref(false)
const currentFile = ref({})
const fileList = ref([])
const total = ref(0)

const queryParams = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
})

const uploadUrl = computed(() => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${baseURL}/file/upload`
})

const uploadHeaders = computed(() => {
  const userStore = useUserStore()
  return {
    Authorization: `Bearer ${userStore.token}`,
  }
})

// #endregion

// #region 上传相关

const beforeUpload = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  if (response && response.code === 200) {
    ElMessage.success('上传成功')
    loadFileList()
  } else {
    ElMessage.error(response?.message || '上传失败')
  }
}

const handleUploadError = (error) => {
  // el-upload error 对象可能是 Error 或包含响应的对象
  let message = '上传失败'
  try {
    const parsed = typeof error === 'string' ? JSON.parse(error) : error
    message = parsed?.message || message
  } catch {
    // 无法解析，使用默认消息
  }
  ElMessage.error(message)
}

// #endregion

// #region 文件列表

const loadFileList = async () => {
  loading.value = true
  try {
    const res = await getFileListAPI({
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      keyword: searchKeyword.value || undefined,
    })
    fileList.value = res?.list || []
    total.value = res?.total || 0
  } catch (error) {
    // 错误由 axios 拦截器处理
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadFileList()
}

const handlePageChange = (val) => {
  queryParams.page = val
  loadFileList()
}

const handleSizeChange = (val) => {
  queryParams.pageSize = val
  queryParams.page = 1
  loadFileList()
}

// #endregion

// #region 文件操作

const handleView = async (row) => {
  try {
    const res = await getFileInfoAPI(row.id)
    currentFile.value = res || row
    detailVisible.value = true
  } catch (error) {
    // 错误由 axios 拦截器处理
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确认要删除文件"${row.originalName}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    try {
      await deleteFileAPI(row.id)
      ElMessage.success('删除成功')
      loadFileList()
    } catch (error) {
      handleApiError(error, 'API')
    }
  } catch {
    // user cancelled
  }
}

// #endregion

// #region 工具函数

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

const isImage = (type) => {
  if (!type) return false
  return type.startsWith('image/')
}

const getFileIcon = (type) => {
  if (!type) return Document
  if (type.startsWith('image/')) return Picture
  if (type.startsWith('video/')) return VideoCamera
  if (type.startsWith('audio/')) return Headset
  return Document
}

// #endregion

// #region 生命周期

onMounted(() => {
  loadFileList()
})

// #endregion
</script>

<style scoped>
.file-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
}

.upload-card {
  margin-bottom: 16px;
}

.upload-area {
  width: 100%;
}

.file-list-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-image {
  margin-top: 16px;
  text-align: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
