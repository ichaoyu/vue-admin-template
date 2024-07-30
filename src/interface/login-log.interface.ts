export interface LoginLogType {
  /**
   * 主键
   */
  id?: string;

  /**
   * 用户账号
   */
  userName?: string;

  /**
   * 浏览器
   */
  browser?: string;

  /**
   * 操作系统
   */
  os?: string;

  /**
   * 登录状态（0成功 1失败）
   */
  status?: string;

  /**
   * 提示消息
   */
  msg?: string;

  /**
   * 登录 IP
   */
  loginIp?: string;

  /**
   * 登录地点
   */
  loginLocation?: string;

  /**
   * 登录时间
   */
  loginDate?: string;
}
