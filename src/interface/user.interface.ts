/**
 * 用户登录数据类型
 */
export interface UserLoginType {
  /**
   * 登录用户名
   */
  username: string;
  /**
   * 登录密码
   */
  password: string;
}
/**
 * 用户类型
 */
export interface UserType {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 角色
   */
  role: string;
  /**
   * 角色id
   */
  roleId: string;
}

/**
 * 用户状态
 */
export interface UserState {
  /**
   * 用户信息
   */
  userInfo?: UserType;
  /**
   * token key值
   */
  tokenKey: string;
  /**
   * token
   */
  token: string;
  /**
   * 角色路由
   */
  roleRouters?: string[] | AppCustomRouteRecordRaw[];
  /**
   * 记住我
   */
  rememberMe: boolean;
  /**
   * 登录信息
   */
  loginInfo?: UserLoginType;
  /**
   * 菜单路由
   */
  menuRoutes?: AppRouteRecordRaw[];
}
