import { defineStore } from 'pinia';
import { loginApi } from '@/api/user';
import { UserLoginType, UserState } from '@/interface';
import { constantRoute } from '@/router/routes';

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: localStorage.getItem('TOKEN') || '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined,
      menuRoutes: constantRoute,
    };
  },
  actions: {
    async login(data: UserLoginType) {
      const res = await loginApi(data);
      if (res?.code === 0) {
        this.token = res.data.token;
        localStorage.setItem('TOKEN', res.data.token);
      }
    },
  },
  getters: {},
});

export default useUserStore;
