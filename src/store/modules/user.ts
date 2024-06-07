import { defineStore } from 'pinia';

import { UserLoginType, UserState, UserType } from '@/interface';
import store from '../index';
import { useStorage } from '@/hooks/useStorage';

const { getStorage } = useStorage();

export const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      token: getStorage('TOKEN') || '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined,
    };
  },
  actions: {
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey;
    },
    setToken(token: string) {
      this.token = token;
    },
    setUserInfo(userInfo?: UserType) {
      this.userInfo = userInfo;
    },
    setRoleRouters(roleRouters: string[] | AppCustomRouteRecordRaw[]) {
      this.roleRouters = roleRouters;
    },
  },
  getters: {
    getTokenKey(): string {
      return this.tokenKey;
    },
    getToken(): string {
      return this.token;
    },
    getUserInfo(): UserType | undefined {
      return this.userInfo;
    },
    getRoleRouters(): string[] | AppCustomRouteRecordRaw[] | undefined {
      return this.roleRouters;
    },
    getRememberMe(): boolean {
      return this.rememberMe;
    },
    getLoginInfo(): UserLoginType | undefined {
      return this.loginInfo;
    },
  },
  persist: true,
});

export const useUserStoreOut = () => {
  return useUserStore(store);
};
