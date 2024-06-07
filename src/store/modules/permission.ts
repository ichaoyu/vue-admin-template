import { defineStore } from 'pinia';
import { asyncRouter, constantRoute } from '@/router';
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes,
} from '@/utils';
import store from '../index';
import { cloneDeep } from 'lodash-es';

export interface PermissionState {
  routers: AppRouteRecordRaw[];
  addRouters: AppRouteRecordRaw[];
  isAddRouters: boolean;
  menuTabRouters: AppRouteRecordRaw[];
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: [],
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers;
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters));
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters;
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters;
    },
  },
  actions: {
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[],
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = [];
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(
            routers as AppCustomRouteRecordRaw[],
          );
          console.log(routerMap);
        } else if (type === 'frontEnd') {
          // 模拟前端过滤菜单
          routerMap = generateRoutesByFrontEnd(
            cloneDeep(asyncRouter),
            routers as string[],
          );
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouter);
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false,
            },
          },
        ]);
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRoute).concat(routerMap);
        resolve();
      });
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state;
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers;
    },
  },
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters'],
  },
});

export const usePermissionStoreOut = () => {
  return usePermissionStore(store);
};
