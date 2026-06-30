<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <div class="forgot-password-header">
        <h2>Vue Admin</h2>
        <p>{{ stateTitle }}</p>
      </div>

      <!-- 第一步：发送验证码 -->
      <el-form
        v-if="state === 'email'"
        ref="emailFormRef"
        :model="emailForm"
        :rules="emailRules"
        class="forgot-password-form"
      >
        <el-form-item prop="email">
          <el-input v-model="emailForm.email" placeholder="请输入邮箱地址" prefix-icon="Message" size="large" />
        </el-form-item>
        <el-form-item prop="captchaValue">
          <div class="captcha-row">
            <el-input v-model="emailForm.captchaValue" placeholder="请输入验证码" prefix-icon="Key" size="large" />
            <div class="captcha-image" @click="refreshCaptcha">
              <img v-if="captchaImage" :src="captchaImage" alt="验证码" />
              <el-icon v-else class="captcha-loading"><Loading /></el-icon>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="submit-btn" @click="handleSendCode">
            发送验证码
          </el-button>
        </el-form-item>
        <el-form-item>
          <router-link to="/login" class="back-link">← 返回登录</router-link>
        </el-form-item>
      </el-form>

      <!-- 第二步：重置密码 -->
      <el-form
        v-if="state === 'reset'"
        ref="resetFormRef"
        :model="resetForm"
        :rules="resetRules"
        class="forgot-password-form"
      >
        <el-form-item>
          <el-input v-model="resetForm.email" disabled prefix-icon="Message" size="large" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="resetForm.code"
            placeholder="请输入6位验证码"
            prefix-icon="Key"
            size="large"
            maxlength="6"
          />
        </el-form-item>
        <div class="hint-text">
          <el-icon><InfoFilled /></el-icon>
          验证码已发送到您的邮箱，15分钟内有效
        </div>
        <el-form-item prop="newPassword">
          <el-input
            v-model="resetForm.newPassword"
            type="password"
            placeholder="请输入新密码（至少6位）"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="resetForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" class="submit-btn" @click="handleResetPassword">
            重置密码
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button link @click="goBackToEmail">← 返回上一步</el-button>
        </el-form-item>
      </el-form>

      <!-- 成功状态 -->
      <div v-if="state === 'success'" class="success-container">
        <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
        <h3>密码重置成功！</h3>
        <p>您的新密码已设置成功，请使用新密码登录</p>
        <p class="countdown-text">{{ countdown }}秒后自动跳转到登录页...</p>
        <el-button type="primary" size="large" class="submit-btn" @click="goToLogin"> 立即登录 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useErrorHandler } from '@/composables/useErrorHandler'
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, InfoFilled, CircleCheckFilled } from '@element-plus/icons-vue'
import { sendResetCodeAPI, resetPasswordAPI, getCaptchaAPI } from '@/api/auth'

const { handleApiError } = useErrorHandler()
const router = useRouter()

// #region 状态管理

const state = ref('email') // 'email' | 'reset' | 'success'
const loading = ref(false)
const captchaImage = ref('')
const captchaId = ref('')
const countdown = ref(3)
let countdownTimer = null

const stateTitle = computed(() => {
  const titles = {
    email: '密码找回',
    reset: '设置新密码',
    success: '操作成功',
  }
  return titles[state.value]
})

// #endregion

// #region 表单数据

const emailFormRef = ref(null)
const resetFormRef = ref(null)

const emailForm = reactive({
  email: '',
  captchaId: '',
  captchaValue: '',
})

const resetForm = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
})

// #endregion

// #region 表单验证

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== resetForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const emailRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  captchaValue: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

const resetRules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

// #endregion

// #region 图形验证码

const refreshCaptcha = async () => {
  try {
    const data = await getCaptchaAPI()
    captchaId.value = data.id
    captchaImage.value = data.image
    emailForm.captchaId = data.id
  } catch (error) {
    handleApiError(error, 'API')
  }
}

// #endregion

// #region 发送验证码

const handleSendCode = async () => {
  if (!emailFormRef.value) return

  await emailFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await sendResetCodeAPI(emailForm)
      ElMessage.success('验证码已发送到您的邮箱')

      // 切换到重置密码步骤
      resetForm.email = emailForm.email
      state.value = 'reset'
    } catch (error) {
      refreshCaptcha()
    } finally {
      loading.value = false
    }
  })
}

// #endregion

// #region 重置密码

const handleResetPassword = async () => {
  if (!resetFormRef.value) return

  await resetFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await resetPasswordAPI(resetForm)
      state.value = 'success'
      startCountdown()
    } catch (error) {
      // 错误由 axios 拦截器处理
    } finally {
      loading.value = false
    }
  })
}

// #endregion

// #region 倒计时

const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      goToLogin()
    }
  }, 1000)
}

const goToLogin = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  router.push('/login')
}

// #endregion

// #region 导航

const goBackToEmail = () => {
  state.value = 'email'
  resetForm.code = ''
  resetForm.newPassword = ''
  resetForm.confirmPassword = ''
}

// #endregion

// #region 生命周期

onMounted(() => {
  refreshCaptcha()
})

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

// #endregion
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.forgot-password-box {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 15%);
}

.forgot-password-header {
  margin-bottom: 30px;
  text-align: center;
}

.forgot-password-header h2 {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.forgot-password-header p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.forgot-password-form {
  width: 100%;
}

.captcha-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.captcha-row .el-input {
  flex: 1;
}

.captcha-image {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.captcha-loading {
  font-size: 20px;
  color: #409eff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.submit-btn {
  width: 100%;
}

.back-link {
  color: #409eff;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.hint-text {
  display: flex;
  gap: 4px;
  align-items: center;
  margin-bottom: 18px;
  font-size: 12px;
  color: #909399;
}

.success-container {
  text-align: center;
}

.success-icon {
  font-size: 64px;
  color: #67c23a;
  margin-bottom: 20px;
}

.success-container h3 {
  margin: 0 0 10px;
  font-size: 20px;
  color: #333;
}

.success-container p {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
}

.countdown-text {
  margin-bottom: 20px !important;
  color: #909399 !important;
}
</style>
