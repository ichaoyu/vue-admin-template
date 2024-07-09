import { ComponentSize } from 'element-plus';
export interface AppState {
  /**
   * 面包屑
   */
  // breadcrumb: boolean;
  /**
   * 面包屑图表
   */
  // breadcrumbIcon: boolean;
  /**
   * 折叠菜单
   */
  collapse: boolean;
  /**
   * 是否只保持一个子菜单的展开
   */
  // uniqueOpened: boolean;
  /**
   * 折叠图标
   */
  // hamburger: boolean;
  /**
   * 全屏图标
   */
  // screenfull: boolean;
  /**
   * 尺寸图标
   */
  size: boolean;
  /**
   * 标签页
   */
  // tagsView: boolean;
  /**
   * 是否显示标签图标
   */
  // tagsViewIcon: boolean;
  /**
   * logo
   */
  logo: boolean;
  /**
   * 固定头部
   */
  // fixedHeader: boolean;
  /**
   * 是否开始灰色模式
   */
  // greyMode: boolean;
  /**
   * 是否动态路由
   */
  // dynamicRouter: boolean;
  /**
   * 是否服务端渲染动态路由
   */
  // serverDynamicRouter: boolean;
  /**
   * 路由跳转loading
   */
  pageLoading: boolean;
  /**
   * layout布局
   */
  // layout: LayoutType;
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
  currentSize: ComponentSize;
  /**
   * 组件默认尺寸组合
   */
  sizeMap: ComponentSize[];
  /**
   * 是否开启水印
   */
  watermark: boolean;
  /**
   * 是否是移动端
   */
  // mobile: boolean;
  /**
   * 显示页脚
   */
  // footer: boolean;
  /**
   * 主题
   */
  // theme: ThemeTypes;
  /**
   * 是否固定菜单
   */

  // locale: boolean;

  // fixedMenu: boolean;
}
