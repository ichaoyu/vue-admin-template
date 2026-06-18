<template>
  <div class="settings-container">
    <el-card shadow="hover">
      <template #header>
        <span>系统设置</span>
      </template>
      <el-tabs v-model="activeTab">
        <!-- #region 基础设置 -->
        <el-tab-pane label="基础设置" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="120px"
            style="max-width: 600px; margin-top: 16px"
          >
            <el-form-item label="站点名称:" prop="siteName">
              <el-input v-model="basicForm.siteName" placeholder="请输入站点名称" maxlength="50" />
            </el-form-item>
            <el-form-item label="站点描述:" prop="siteDescription">
              <el-input
                v-model="basicForm.siteDescription"
                type="textarea"
                placeholder="请输入站点描述"
                :rows="3"
                maxlength="200"
              />
            </el-form-item>
            <el-form-item label="备案号:">
              <el-input v-model="basicForm.icp" placeholder="请输入ICP备案号" maxlength="50" />
            </el-form-item>
            <el-form-item label="版权信息:">
              <el-input v-model="basicForm.copyright" placeholder="请输入版权信息" maxlength="100" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="submitLoading" @click="handleSaveBasic">保存设置</el-button>
              <el-button @click="resetBasicForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- #endregion -->

        <!-- #region 主题设置 -->
        <el-tab-pane label="主题设置" name="theme">
          <div class="setting-section">
            <h4 class="section-title">外观模式</h4>
            <div class="theme-switch-row">
              <span class="switch-label">深色模式</span>
              <el-switch v-model="isDark" active-text="开启" inactive-text="关闭" @change="handleThemeChange" />
            </div>
          </div>

          <div class="setting-section">
            <h4 class="section-title">主题色</h4>
            <div class="color-options">
              <div
                v-for="color in themeColors"
                :key="color.value"
                class="color-option"
                :class="{ active: currentColor === color.value }"
                :style="{ backgroundColor: color.value }"
                @click="handleChangeColor(color.value)"
              >
                <el-icon v-if="currentColor === color.value"><Check /></el-icon>
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h4 class="section-title">侧边栏</h4>
            <div class="switch-row">
              <span class="switch-label">固定侧边栏</span>
              <el-switch v-model="sidebarFixed" />
            </div>
          </div>
        </el-tab-pane>
        <!-- #endregion -->
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { useThemeStore } from '@/store/theme'

defineOptions({
  name: 'SystemSettings',
})

const themeStore = useThemeStore()

// #region 数据定义

const activeTab = ref('basic')
const submitLoading = ref(false)
const basicFormRef = ref(null)

// 基本设置表单
const basicForm = reactive({
  siteName: '',
  siteDescription: '',
  icp: '',
  copyright: '',
})

const basicRules = {
  siteName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
}

// 主题相关
const isDark = computed({
  get: () => themeStore.isDark,
  set: (val) => {
    if (val) {
      themeStore.setDarkMode()
    } else {
      themeStore.setLightMode()
    }
  },
})
const sidebarFixed = ref(true)

const themeColors = [
  { value: '#409EFF', name: '默认蓝' },
  { value: '#67C23A', name: '成功绿' },
  { value: '#E6A23C', name: '警告橙' },
  { value: '#F56C6C', name: '危险红' },
  { value: '#909399', name: '信息灰' },
]
const currentColor = ref('#409EFF')

// #endregion

// #region 基础设置操作

/**
 * 从localStorage加载已保存的设置
 */
const loadBasicSettings = () => {
  try {
    const saved = localStorage.getItem('system_basic_settings')
    if (saved) {
      const data = JSON.parse(saved)
      Object.assign(basicForm, data)
    }
  } catch (e) {
    // 使用默认值
  }
}

/**
 * 保存基础设置（本地存储）
 */
const handleSaveBasic = async () => {
  if (!basicFormRef.value) return
  await basicFormRef.value.validate((valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      localStorage.setItem('system_basic_settings', JSON.stringify(basicForm))
      ElMessage.success('设置已保存')
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      submitLoading.value = false
    }
  })
}

/**
 * 重置表单
 */
const resetBasicForm = () => {
  loadBasicSettings()
  basicFormRef.value?.clearValidate()
}

// #endregion

// #region 主题操作

/**
 * 切换深色/浅色模式
 */
const handleThemeChange = (val) => {
  // 已通过 computed 双向绑定自动处理
}

/**
 * 切换主题色
 */
const handleChangeColor = (color) => {
  currentColor.value = color
  document.documentElement.style.setProperty('--el-color-primary', color)
  ElMessage.success(`主题色已切换为 ${color}`)
}

// #endregion

// #region 生命周期

onMounted(() => {
  loadBasicSettings()
  // 加载已保存的主题色
  const savedColor = localStorage.getItem('theme_primary_color')
  if (savedColor) {
    currentColor.value = savedColor
    document.documentElement.style.setProperty('--el-color-primary', savedColor)
  }
})

// #endregion
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.setting-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    border-bottom: none;
  }
}

.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.switch-row,
.theme-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 300px;
}

.switch-label {
  font-size: 14px;
  color: #606266;
}

.color-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: 2px solid transparent;
  color: #fff;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    border-color: #303133;
    box-shadow: 0 0 0 2px rgb(0 0 0 / 15%);
  }
}
</style>
