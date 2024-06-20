import { RawAxiosRequestHeaders } from 'axios';
declare global {
  declare interface Fn<T = any> {
    (...arg: T[]): T;
  }

  declare type Nullable<T> = T | null;

  declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
  declare type Recordable<T = any, K = string> = Record<
    K extends null | undefined ? string : K,
    T
  >;

  declare type ComponentRef<T> = InstanceType<T>;

  declare type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu';

  declare type ElementSize = 'default' | 'mini' | 'large';

  declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put';
  declare type AxiosResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';
  declare type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';
  declare interface AxiosConfig {
    params?: any;
    data?: any;
    url?: string;
    method?: AxiosMethod;
    headers?: RawAxiosRequestHeaders;
    responseType?: AxiosResponseType;
  }

  declare interface IResponse<T = any> {
    code: number;
    data: T extends any ? T : T & any;
    msg: string;
  }

  declare interface ThemeTypes {
    /**
     * 主题色
     */
    elColorPrimary?: string;
    /**
     * 左侧菜单边框颜色
     */
    leftMenuBorderColor?: string;
    /**
     * 左侧菜单背景颜色
     */
    leftMenuBgColor?: string;
    /**
     * 左侧菜单浅色背景颜色
     */
    leftMenuBgLightColor?: string;
    /**
     * 左侧菜单选中背景颜色
     */
    leftMenuBgActiveColor?: string;
    /**
     * 左侧菜单收起选中背景颜色
     */
    leftMenuCollapseBgActiveColor?: string;
    /**
     * 左侧菜单字体颜色
     */
    leftMenuTextColor?: string;
    /**
     * 左侧菜单选中字体颜色
     */
    leftMenuTextActiveColor?: string;
    /**
     * logo字体颜色
     */
    logoTitleTextColor?: string;
    /**
     * logo边框颜色
     */
    logoBorderColor?: string;
    /**
     * 头部背景颜色
     */
    topHeaderBgColor?: string;
    /**
     * 头部字体颜色
     */
    topHeaderTextColor?: string;
    /**
     * 头部悬停颜色
     */
    topHeaderHoverColor?: string;
    /**
     * 头部边框颜色
     */
    topToolBorderColor?: string;
  }
}
