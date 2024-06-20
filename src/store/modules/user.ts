import { defineStore } from 'pinia';
import { UserState } from '@/interface';
import store from '../index';

export const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      username: '',
      tokenKey: 'Authorization',
      token: '',
      roleIDs: [],
      permission: [],
      rememberMe: true,
    };
  },
  actions: {
    setUserName(username: string) {
      this.username = username;
    },
    setTokenKey(tokenKey: string) {
      this.tokenKey = tokenKey;
    },
    setToken(token: string) {
      this.token = token;
    },
    setRoleIDs(ids: string[] | undefined) {
      this.roleIDs = ids;
    },
    setRememberMe(rememberMe: boolean) {
      this.rememberMe = rememberMe;
    },
    setPermission(ids: string[] | undefined) {
      this.permission = ids;
    },
  },
  getters: {
    getUserName(): string {
      return this.username;
    },
    getTokenKey(): string | undefined {
      return this.tokenKey;
    },
    getToken(): string {
      return this.token;
    },
    getRoleIDs(): string[] | undefined {
      return this.roleIDs;
    },
    getPermission(): string[] | undefined {
      return this.permission;
    },
    getRememberMe(): boolean | undefined {
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
