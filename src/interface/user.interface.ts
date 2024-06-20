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
 * 用户状态
 */
export interface UserState {
  /**
   * 用户名
   */
  username: string;
  /**
   * token key值
   */
  tokenKey?: string;
  /**
   * token
   */
  token: string;
  /**
   * 角色
   */
  roleIDs?: string[];
  /**
   * 权限
   */
  permission?: string[];
  /**
   * 记住我
   */
  rememberMe?: boolean;
}

/**
 * 角色信息
 */
export interface RoleParams {
  /**
   * 用户角色名称
   */
  roleName: string;
}
