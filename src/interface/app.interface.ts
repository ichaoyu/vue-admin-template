import { ElementSize } from '@/types';

export interface AppState {
  /**
   * 折叠菜单
   */
  collapse: boolean;
  /**
   * 尺寸图标
   */
  size: boolean;
  /**
   * logo
   */
  logo: boolean;
  /**
   * 路由跳转loading
   */
  pageLoading: boolean;
  /**
   * 标题
   */
  title: string;
  /**
   * 是否是暗黑模式
   */
  isDark: boolean;
  /**
   * 组件尺寸
   */
  currentSize: ElementSize;
  /**
   * 组件默认尺寸组合
   */
  sizeMap: ElementSize[];
  /**
   * 是否开启水印
   */
  watermark: boolean;
}
