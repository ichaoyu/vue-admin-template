export interface siteInfoType {
  id?: number;
  /**
   * 网站名称
   */
  name: string;

  /**
   * 网站域名
   */
  domain: string;

  /**
   * 邮箱
   */
  email: string;

  /**
   * 微信
   */
  wx: string;

  /**
   * ICP备案号
   */
  icp: string;

  /**
   * 站点统计代码
   */
  code: string;

  /**
   * 万能配置
   */
  json: string;

  /**
   * 页面标题
   */
  title: string;

  /**
   * 页面关键词
   */
  keywords: string;

  /**
   * 页面描述
   */
  description: string;

  /**
   * view模板
   */
  template: string;

  /**
   * 微信小程序appid
   */
  appid: string;

  /**
   * 微信小程序secret
   */
  secret: string;

  /**
   * 创建时间
   */
  createTime?: Date;

  /**
   * 更新时间
   */
  updateTime?: Date;
}
