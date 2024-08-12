export interface MessageType {
  /**
   * 主键
   */
  id?: number;

  /**
   * 姓名
   */
  name: string;

  /**
   * 电话
   */
  tel?: string;

  /**
   * 公司名称
   */
  company?: string;

  /**
   * 留言内容
   */
  content?: string;

  /**
   * 创建时间
   */
  createTime?: Date;

  /**
   * 更新时间
   */
  updateTime?: Date;
}
