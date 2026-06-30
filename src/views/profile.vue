<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- #region 左侧：用户信息卡片 -->
      <el-col :span="8">
        <el-card shadow="hover" class="user-card">
          <div class="user-avatar-wrapper">
            <el-avatar :size="100" :src="profile.avatar" class="user-avatar">
              {{ (profile.nickName || profile.userName || 'U').charAt(0).toUpperCase() }}
            </el-avatar>
            <el-upload
              v-if="!uploadLoading"
              :show-file-list="false"
              :before-upload="handleAvatarUpload"
              accept="image/*"
              class="avatar-upload"
            >
              <div class="avatar-edit-btn">
                <el-icon><Camera /></el-icon>
              </div>
            </el-upload>
          </div>
          <h3 class="user-nick">{{ profile.nickName || profile.userName }}</h3>
          <p class="user-account">@{{ profile.userName }}</p>
          <el-descriptions :column="1" size="small" class="user-desc">
            <el-descriptions-item label="用户ID">{{ profile.userId || '-' }}</el-descriptions-item>
            <el-descriptions-item label="性别">
              <dict-tag :value="profile.sex" dict-type="sys_user_sex" />
            </el-descriptions-item>
            <el-descriptions-item label="手机号">{{ profile.phone || '未绑定' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ profile.email || '未绑定' }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <DictTag :value="profile.status" dict-type="sys_normal_disable" />
            </el-descriptions-item>
            <el-descriptions-item label="最后登录IP">{{ profile.loginIp || '-' }}</el-descriptions-item>
            <el-descriptions-item label="登录时间">
              {{ profile.loginDate ? formatDateTime(profile.loginDate) : '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ profile.createTime ? formatDateTime(profile.createTime) : '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <!-- #endregion -->

      <!-- #region 右侧：编辑表单 -->
      <el-col :span="16">
        <el-card shadow="hover">
          <el-tabs v-model="activeTab">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="base">
              <el-form
                ref="baseFormRef"
                :model="baseForm"
                :rules="baseRules"
                label-width="100px"
                style="max-width: 500px; margin-top: 16px"
              >
                <el-form-item label="用户昵称:" prop="nickName">
                  <el-input v-model="baseForm.nickName" placeholder="请输入昵称" maxlength="20" />
                </el-form-item>
                <el-form-item label="手机号码:" prop="phone">
                  <el-input v-model="baseForm.phone" placeholder="请输入手机号码" maxlength="11" />
                </el-form-item>
                <el-form-item label="邮箱:" prop="email">
                  <el-input v-model="baseForm.email" placeholder="请输入邮箱" maxlength="50" />
                </el-form-item>
                <el-form-item label="性别:">
                  <DictSelect v-model="baseForm.sex" dict-type="sys_user_sex" />
                </el-form-item>
                <el-form-item label="备注:">
                  <el-input
                    v-model="baseForm.remark"
                    type="textarea"
                    placeholder="请输入备注"
                    :rows="2"
                    maxlength="200"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="submitBaseLoading" @click="handleSaveBase">保存修改</el-button>
                  <el-button @click="resetBaseForm">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 修改密码 -->
            <el-tab-pane label="修改密码" name="password">
              <el-form
                ref="pwdFormRef"
                :model="pwdForm"
                :rules="pwdRules"
                label-width="100px"
                style="max-width: 500px; margin-top: 16px"
              >
                <el-form-item label="旧密码:" prop="oldPassword">
                  <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
                </el-form-item>
                <el-form-item label="新密码:" prop="newPassword">
                  <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码" />
                  <div class="form-tip">密码长度6-20位，必须包含字母和数字</div>
                </el-form-item>
                <el-form-item label="确认密码:" prop="confirmPassword">
                  <el-input
                    v-model="pwdForm.confirmPassword"
                    type="password"
                    show-password
                    placeholder="请再次输入新密码"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" :loading="submitPwdLoading" @click="handleUpdatePassword"
                    >修改密码</el-button
                  >
                  <el-button @click="resetPwdForm">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!-- #endregion -->
    </el-row>
  </div>
</template>

<script setup>
import { useErrorHandler } from '@/composables/useErrorHandler'
import { ElMessage } from 'element-plus'
import { Camera } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { getUserProfileAPI, updateUserBaseAPI, updateUserPasswordAPI } from '@/api/auth'
import { formatDateTime } from '@/utils/date'

const { handleApiError } = useErrorHandler()

defineOptions({
  name: 'UserProfile',
})

const userStore = useUserStore()

// #region 数据定义

const activeTab = ref('base')
const uploadLoading = ref(false)
const submitBaseLoading = ref(false)
const submitPwdLoading = ref(false)

const baseFormRef = ref(null)
const pwdFormRef = ref(null)

// 用户资料
const profile = ref({})

// 基本信息表单
const baseForm = reactive({
  nickName: '',
  phone: '',
  email: '',
  sex: 2,
  remark: '',
})

// 密码表单
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表单校验规则
const baseRules = {
  nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
}

const validateConfirmPass = (rule, value, callback) => {
  if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPass, trigger: 'blur' },
  ],
}

// #endregion

// #region 数据加载

/**
 * 加载用户资料
 */
const loadProfile = async () => {
  try {
    const res = await getUserProfileAPI()
    profile.value = res || {}
    // 填充表单
    Object.assign(baseForm, {
      nickName: res?.nickName || '',
      phone: res?.phone || '',
      email: res?.email || '',
      sex: res?.sex || 2,
      remark: res?.remark || '',
    })
  } catch (error) {
    handleApiError(error, 'API')
  }
}

// #endregion

// #region 头像上传

/**
 * 头像上传前校验
 */
const handleAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return false
}

// #endregion

// #region 基本信息操作

/**
 * 保存基本信息
 */
const handleSaveBase = async () => {
  if (!baseFormRef.value) return
  await baseFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitBaseLoading.value = true
    try {
      await updateUserBaseAPI(baseForm)
      ElMessage.success('修改成功')
      loadProfile()
      // 同步更新store中的用户名显示
      userStore.setUserInfo({ ...userStore.userInfo, nickName: baseForm.nickName })
    } catch (error) {
      handleApiError(error, 'API')
    } finally {
      submitBaseLoading.value = false
    }
  })
}

/**
 * 重置基本信息表单
 */
const resetBaseForm = () => {
  Object.assign(baseForm, {
    nickName: profile.value?.nickName || '',
    phone: profile.value?.phone || '',
    email: profile.value?.email || '',
    sex: profile.value?.sex || 2,
    remark: profile.value?.remark || '',
  })
  baseFormRef.value?.clearValidate()
}

// #endregion

// #region 密码操作

/**
 * 修改密码
 */
const handleUpdatePassword = async () => {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate(async (valid) => {
    if (!valid) return
    submitPwdLoading.value = true
    try {
      await updateUserPasswordAPI({
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword,
        confirmPassword: pwdForm.confirmPassword,
      })
      ElMessage.success('密码修改成功，请重新登录')
      resetPwdForm()
    } catch (error) {
      handleApiError(error, 'API')
    } finally {
      submitPwdLoading.value = false
    }
  })
}

/**
 * 重置密码表单
 */
const resetPwdForm = () => {
  pwdForm.oldPassword = ''
  pwdForm.newPassword = ''
  pwdForm.confirmPassword = ''
  pwdFormRef.value?.clearValidate()
}

// #endregion

// #region 生命周期

onMounted(() => {
  loadProfile()
})

// #endregion
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.user-card {
  text-align: center;
}

.user-avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.user-avatar {
  background-color: #409eff;
  font-size: 40px;
}

.avatar-upload {
  position: absolute;
  bottom: 4px;
  right: 4px;
}

.avatar-edit-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #409eff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #fff;
  transition: background-color 0.2s;

  &:hover {
    background-color: #66b1ff;
  }
}

.user-nick {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-account {
  margin: 0 0 16px;
  font-size: 13px;
  color: #909399;
}

.user-desc {
  text-align: left;

  & :deep(.el-descriptions__label) {
    width: 80px;
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}
</style>
