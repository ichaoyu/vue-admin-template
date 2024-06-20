<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="24" :offset="12">
        <el-form class="login_form">
          <h1>Hello</h1>
          <h2>vue-admin-template</h2>
          <icon-font name="icon-setting" />
          <icon-font name="icon-watch" />
          <icon-font
            name="icon-fullscreen"
            color="var(--el-color-primary)"
            style="color: var(--el-color-primary)"
          />
          <el-form-item>
            <el-input
              placeholder="登录账号"
              :prefix-icon="User"
              v-model="loginForm.username"
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
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref, watch } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { loginApi } from '@/api/user';
import { useUserStore } from '@/store/modules/user';
import { UserState } from '@/interface';

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
  username: 'admin',
  password: '123456',
});
const loading = ref<boolean>(false);
const onSubmit = async () => {
  try {
    loading.value = true;
    const res: IResponse<UserState> = await loginApi(loginForm);
    if (res) {
      onSetStore(res as unknown as UserState);
    }
    push('/');
  } catch (err) {
    ElNotification({
      type: 'error',
      message: (err as Error).message,
    });
  } finally {
    loading.value = false;
  }
};
// 登录成功设置store
const onSetStore = (info: UserState): void => {
  userStore.setRoleIDs(info.roleIDs);
  userStore.setPermission(info.permission);
  userStore.setToken(info.token);
  userStore.setUserName(info.username);
};
</script>

<style scoped lang="scss">
.login_container {
  widows: 100%; //宽度跟浏览器一样宽
  height: 100vh; //1vh 屏幕可见高度的1%
  background: '#ccc';

  .login_form {
    position: relative;
    top: 30vh;
    width: 100%;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      margin: 20px 0;
      color: w hite;
      font-size: 20px;
    }
  }
}
</style>
