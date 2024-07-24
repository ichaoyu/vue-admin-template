<template>
  <div class="login_container">
    <el-row>
      <el-col :sm="{ span: 12, offset: 11 }" :xs="{ span: 22, offset: 1 }">
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
        </el-form>
      </el-col>
    </el-row>
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
    const res: IResponse<Captcha> = await verifyCodeApi();
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
    const res: IResponse<string> = await loginApi(loginForm);
    if (res) {
      userStore.setToken(res);
      await fetchUserInfo();
    }
    push({ path: redirect.value || '/' });
    // push('/');
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
  widows: 100%; //宽度跟浏览器一样宽
  height: 100vh; //1vh 屏幕可见高度的1%
  background: '#ccc';

  .login_form {
    // position: relative;
    // top: 30vh;
    // width: 100%;
    // padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      margin: 20px 0;
      color: w hite;
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
  }
}
</style>
