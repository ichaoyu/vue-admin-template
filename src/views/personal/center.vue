<template>
  <page-container :title="meta.title" class="personal-center-container">
    <el-tabs v-model="activeTab" type="card">
      <!-- 个人信息 -->
      <el-tab-pane label="个人信息" name="info">
        <el-card shadow="never" class="personal-info-card">
          <el-form
            ref="infoFormRef"
            :model="userInfo"
            :rules="infoRules"
            label-width="120px"
            class="personal-info-form"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="用户名" prop="userName">
                  <el-input v-model="userInfo.userName" placeholder="请输入用户名" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="userInfo.nickName" placeholder="请输入昵称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="userInfo.phone" placeholder="请输入手机号" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="userInfo.sex">
                    <el-radio label="0">男</el-radio>
                    <el-radio label="1">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门" prop="deptName">
                  <el-input v-model="userInfo.deptName" placeholder="部门" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input
                    v-model="userInfo.remark"
                    type="textarea"
                    placeholder="请输入备注"
                    :rows="4"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24" class="form-actions">
                <el-button @click="resetForm">重置</el-button>
                <el-button type="primary" @click="handleSubmit">保存</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 密码修改 -->
      <el-tab-pane label="密码修改" name="password">
        <el-card shadow="never" class="personal-password-card">
          <el-form
            ref="pwdFormRef"
            :model="pwdForm"
            :rules="pwdRules"
            label-width="120px"
            class="personal-pwd-form"
          >
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input
                    v-model="pwdForm.oldPassword"
                    type="password"
                    placeholder="请输入原密码"
                    show-password
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="pwdForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="pwdForm.confirmPassword"
                    type="password"
                    placeholder="请确认新密码"
                    show-password
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24" class="form-actions">
                <el-button @click="resetPwdForm">重置</el-button>
                <el-button type="primary" @click="handlePwdSubmit">保存</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 头像上传 -->
      <el-tab-pane label="头像上传" name="avatar">
        <el-card shadow="never" class="personal-avatar-card">
          <div class="avatar-upload-container">
            <div class="avatar-preview">
              <el-avatar :size="120" :src="userInfo.avatar">
                {{ userInfo.nickName?.charAt(0) || 'U' }}
              </el-avatar>
              <div class="avatar-tip">
                <el-text type="info">建议上传 120 x 120 像素的图片</el-text>
              </div>
            </div>
            <div class="avatar-upload">
              <el-upload
                class="avatar-uploader"
                action="/api/current-user/updateAvatar"
                :show-file-list="false"
                :headers="{ 'Authorization': `Bearer ${getToken()}` }"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-button type="primary">上传头像</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传 JPG/PNG 文件，且不超过 2MB
                  </div>
                </template>
              </el-upload>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </page-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getUserInfoApi, updateUserInfoApi, updateUserPwdApi } from '@/api/user.api';

// 模拟 getToken 函数，实际项目中应该从 store 或 cookie 中获取 token
const getToken = () => {
  return localStorage.getItem('token') || '';
};

const { name, meta } = useRoute();
const router = useRouter();

// 响应式数据
const activeTab = ref('info');

// 用户信息
const userInfo = ref({
  id: null,
  userName: '',
  nickName: '',
  email: '',
  phone: '',
  sex: '0',
  deptName: '',
  avatar: '',
  remark: '',
});

// 表单引用
const infoFormRef = ref();
const pwdFormRef = ref();

// 个人信息表单规则
const infoRules = {
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
};

// 密码表单
const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// 密码表单规则
const pwdRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === pwdForm.value.oldPassword) {
          callback(new Error('新密码不能与原密码相同'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.newPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
};

// 生命周期钩子
onMounted(() => {
  fetchUserInfo();
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfoApi();
    userInfo.value = res;
  } catch (err) {
    console.error(err);
    ElMessage.error('获取用户信息失败');
  }
};

// 提交个人信息
const handleSubmit = async () => {
  if (!infoFormRef.value) return;
  await infoFormRef.value.validate((valid) => {
    if (valid) {
      submitInfoForm();
    }
  });
};

// 执行个人信息提交
const submitInfoForm = async () => {
  try {
    await updateUserInfoApi(userInfo.value);
    ElMessage.success('保存成功');
    fetchUserInfo();
  } catch (err) {
    console.error(err);
    ElMessage.error('保存失败');
  }
};

// 重置个人信息表单
const resetForm = () => {
  if (infoFormRef.value) {
    infoFormRef.value.resetFields();
  }
  fetchUserInfo();
};

// 提交密码修改
const handlePwdSubmit = async () => {
  if (!pwdFormRef.value) return;
  await pwdFormRef.value.validate((valid) => {
    if (valid) {
      submitPwdForm();
    }
  });
};

// 执行密码提交
const submitPwdForm = async () => {
  try {
    await updateUserPwdApi(pwdForm.value);
    ElMessage.success('密码修改成功');
    resetPwdForm();
    // 密码修改成功后退出登录，需要重新登录
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  } catch (err) {
    console.error(err);
    ElMessage.error('密码修改失败');
  }
};

// 重置密码表单
const resetPwdForm = () => {
  if (pwdFormRef.value) {
    pwdFormRef.value.resetFields();
  }
  pwdForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
};

// 头像上传成功
const handleAvatarSuccess = (res, file) => {
  if (res.code === 200) {
    userInfo.value.avatar = URL.createObjectURL(file.raw);
    ElMessage.success('头像上传成功');
    fetchUserInfo();
  } else {
    ElMessage.error(res.msg || '头像上传失败');
  }
};

// 头像上传前验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片');
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB');
  }

  return isJPG && isLt2M;
};
</script>

<style lang="scss" scoped>
.personal-center-container {
  .personal-info-card,
  .personal-password-card,
  .personal-avatar-card {
    margin-bottom: 20px;
  }

  .personal-info-form,
  .personal-pwd-form {
    .form-actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 20px;
    }
  }

  .personal-avatar-card {
    .avatar-upload-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;

      .avatar-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;

        .avatar-tip {
          margin-top: 10px;
        }
      }

      .avatar-upload {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>