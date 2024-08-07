import { defineStore } from 'pinia';
import { UserState, userInfo } from '@/interface';
import store from '../index';

export const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      userName: '',
      tokenKey: 'authorization',
      user: null,
      token: '',
      roles: [],
      permissions: [],
      rememberMe: true,
    };
  },
  actions: {
    setUserInfo(user: userInfo | null) {
      this.user = user;
    },
    setUserName(username: string) {
      this.userName = username;
    },
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey;
    },
    setToken(token: string) {
      this.token = token;
    },
    setRoles(keys: string[]) {
      this.roles = keys;
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe;
    },
    setPermissions(keys: string[]) {
      this.permissions = keys;
    },
  },
  getters: {
    getUserinfo(): userInfo | null {
      return this.user;
    },
    getTokenKey(): string | undefined {
      return this.tokenKey;
    },
    getToken(): string | null {
      return this.token || null;
    },
    getRoles(): string[] | undefined {
      return this.roles;
    },
    getPermissions(): string[] | undefined {
      return this.permissions;
    },
    getRememberMe(): boolean {
      return this.rememberMe;
    },
  },
  persist: {
    key: 'userInfo',
    storage: sessionStorage,
  },
});

export const useUserStoreOut = () => {
  return useUserStore(store);
};
