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
          <div class="el-upload__tip">支持上传任意类型文件，单个文件大小不超过 50MB</div>
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
              v-if="isImage(row.type)"
              :src="row.url"
              :preview-src-list="[row.url]"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 4px"
            />
            <el-icon v-else :size="40" color="#909399">
              <component :is="getFileIcon(row.type)" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="文件名" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="文件类型" width="120" />
        <el-table-column label="文件大小" width="120" align="center">
          <template #default="{ row }">
            {{ formatFileSize(row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="上传时间" width="180" />
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link :icon="View" @click="handleView(row)"> 查看 </el-button>
            <el-button type="danger" size="small" link :icon="Delete" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- #endregion -->

    <!-- #region 文件详情对话框 -->
    <el-dialog v-model="detailVisible" title="文件详情" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="文件名">{{ currentFile.name }}</el-descriptions-item>
        <el-descriptions-item label="文件类型">{{ currentFile.type }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{ formatFileSize(currentFile.size) }}</el-descriptions-item>
        <el-descriptions-item label="文件路径">
          <el-link :href="currentFile.url" target="_blank" type="primary">
            {{ currentFile.url }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="上传时间">{{ currentFile.createTime }}</el-descriptions-item>
      </el-descriptions>
      <div v-if="isImage(currentFile.type)" class="preview-image">
        <el-image :src="currentFile.url" fit="contain" style="width: 100%; max-height: 400px" />
      </div>
    </el-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
import { getFileInfoAPI, deleteFileAPI } from '@/api/system/file'

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
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB!')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  if (response) {
    ElMessage.success('上传成功')
    loadFileList()
  }
}

const handleUploadError = () => {
  ElMessage.error('上传失败')
}

// #endregion

// #region 文件列表

const loadFileList = async () => {
  loading.value = true
  try {
    // 这里需要后端提供文件列表接口
    // 暂时使用模拟数据
    fileList.value = []
  } catch (error) {
    console.error('获取文件列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 实现搜索逻辑
}

// #endregion

// #region 文件操作

const handleView = async (row) => {
  try {
    const res = await getFileInfoAPI(row.id)
    currentFile.value = res || row
    detailVisible.value = true
  } catch (error) {
    console.error('获取文件详情失败:', error)
    ElMessage.error('获取文件详情失败')
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除文件"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteFileAPI(row.id)
      ElMessage.success('删除成功')
      loadFileList()
    } catch (error) {
      console.error('删除文件失败:', error)
      ElMessage.error('删除失败')
    }
  })
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
</style>
