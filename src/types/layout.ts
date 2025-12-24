// 布局类型
export declare type LayoutType = 'classic' | 'topLeft' | 'top' | 'cutMenu';

// 元素尺寸类型
export declare type ElementSize = 'default' | 'small' | 'large';

// 主题类型
export declare interface ThemeTypes {
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
