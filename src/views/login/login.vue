<template>
  <div class="login_container">
    <div class="login-box">
      <div class="header"></div>
      <el-form class="login_form" size="default" @keyup.enter="onSubmit">
        <h1>Hello</h1>
        <h2>vue-admin-template</h2>
        <el-form-item>
          <el-input
            placeholder="登录账号"
            :prefix-icon="User"
            v-model="loginForm.userName"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="登录密码"
            type="password"
            :prefix-icon="Lock"
            v-model="loginForm.password"
            show-password
          />
        </el-form-item>
        <el-form-item class="item-verifycode">
          <el-input
            placeholder="验证码"
            :prefix-icon="CreditCard"
            v-model="loginForm.captchaValue" />
          <el-image
            :src="verifyCodeData"
            class="verify-code-image"
            @click="onChangeCode"
        /></el-form-item>
        <el-form-item>
          <el-button
            class="login_btn"
            type="primary"
            size="default"
            :loading="loading"
            @click="onSubmit"
            >登录</el-button
          >
        </el-form-item>
        <div class="login-extra">
          <div class="btn-forgetPwd">忘记密码？</div>
          <div class="btn-reg">注册</div>
        </div>
      </el-form>
      <div class="footer">Design By chaoyu</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock, CreditCard } from '@element-plus/icons-vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { ElMessage } from 'element-plus';
import { loginApi, verifyCodeApi, getUserInfoApi } from '@/api/user.api';
import { useUserStore } from '@/store/modules/user';
import { UserState, Captcha } from '@/interface';

const userStore = useUserStore();
const { currentRoute, push } = useRouter();
const redirect = ref<string>('');
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string;
  },
  {
    immediate: true,
  },
);

let loginForm = reactive({
  userName: '',
  password: '',
  captchaValue: '',
  captchaId: '',
});
onMounted(() => {
  getVerifyCode();
});
// 验证码
const verifyCodeData = ref<string | undefined>('');
// 点击获取
const onChangeCode = () => {
  getVerifyCode();
};
// api获取验证码
const getVerifyCode = async () => {
  try {
    const res: Captcha = await verifyCodeApi();
    verifyCodeData.value = res?.imageBase64;
    loginForm.captchaId = res?.id;
  } catch (err) {
    console.error(err);
  }
};

const loading = ref<boolean>(false);
const onSubmit = async () => {
  try {
    loading.value = true;
    if (
      loginForm.userName === '' ||
      loginForm.password === '' ||
      loginForm.captchaValue === ''
    ) {
      ElMessage.error('请输入完整登录信息');
      return;
    }
    ElMessage.success('登录中...');
    const res: string = await loginApi(loginForm);
    if (res) {
      userStore.setToken(res);
      await fetchUserInfo();
      ElMessage.closeAll();
      push({ path: redirect.value || '/' });
    }
  } catch (err) {
    console.log('err: ', err);
  } finally {
    loading.value = false;
  }
};
// 获取用户信息
const fetchUserInfo = async () => {
  const res = await getUserInfoApi();
  onSetStore(res);
};
// 登录成功设置store
const onSetStore = (info: UserState): void => {
  userStore.setRoles(info.roles);
  userStore.setPermissions(info.permissions);
  userStore.setUserInfo(info?.user);
};
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/images/login-bg.png');
  background-repeat: no-repeat;
  background-position: center;

  .login-box {
    @include flex-layout($direction: column, $justify: space-between);

    height: 100%;
  }

  .login_form {
    text-align: center;

    h1 {
      font-size: 40px;
    }

    h2 {
      margin-bottom: 20px;
      font-size: 20px;
    }

    .item-verifycode {
      :deep(.el-form-item__content) {
        @include flex-layout();
      }
    }

    .verify-code-image {
      cursor: pointer;
    }

    .login_btn {
      width: 100%;
    }

    .login-extra {
      @include flex-layout($justify: space-between);

      color: var(--el-color-primary);

      .btn-forgetPwd {
        @extend %item-hover;
      }

      .btn-reg {
        @extend %item-hover;
      }
    }
  }

  .footer {
    height: 50px;
    line-height: 50px;
  }
}
</style>
