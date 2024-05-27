import { defineStore } from 'pinia';
import { loginApi } from '@/api/user';
import { UserType, UserLoginType } from '@/interface';
interface UserState {
  userInfo?: UserType;
  tokenKey: string;
  token: string;
  roleRouters?: string[] | AppCustomRouteRecordRaw[];
  rememberMe: boolean;
  loginInfo?: UserLoginType;
}
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
