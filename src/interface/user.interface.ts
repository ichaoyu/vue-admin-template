/**
 * 用户登录数据类型
 */
export interface UserLoginType {
  /**
   * 登录用户名
   */
  userName: string;
  /**
   * 登录密码
   */
  password: string;
  /**
   * 验证码
   */
  captchaValue: string;
  /**
   * 验证码ID
   */
  captchaId: string;
}

/**
 * 用户状态
 */
export interface UserState {
  /**
   * 用户名
   */
  userName?: string;
  /**
   * token key值
   */
  tokenKey?: string;
  /**
   * token
   */
  token?: string;
  /**
   * 角色
   */
  roles: string[];
  /**
   * 权限
   */
  permissions: string[];
  /**
   * 用户信息
   */
  user: UserInfo | null;
  /**
   * 记住我
   */
  rememberMe: boolean;
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

/**
 * 验证码
 */
export interface Captcha {
  /**
   * 验证码ID
   */
  id: string;
  /**
   * 验证码图片base64
   */
  imageBase64: string;
}

/**
 * 用户信息
 */
export interface UserInfo {
  id?: number;
  userName: string;
  nickName?: string;
  email?: string;
  phone?: string;
  sex: string;
  avatar?: string;
  status: string;
  delFlag: string;
  loginIp?: string;
  loginDate: string;
  remark?: string;
  createBy?: string;
  createTime: string;
  updateBy?: string;
  updateTime?: string | null;
  dept?: {
    id?: number;
    parentId?: string;
    ancestors?: string;
    deptName?: string;
    orderNum?: number;
    leader?: string;
    phone?: string;
    email?: string;
    status: string;
    delFlag: string;
    createBy?: string;
    createTime?: string;
    updateBy?: string;
    updateTime?: string;
  };
}
