export interface TagType {
  /**
   * ID
   */
  id?: number;
  /**
   * 标签名称
   */
  name: string;
  /**
   * 标识
   */
  path?: string;
  /**
   * 创建时间
   */
  createTime?: Date;

  /**
   * 更新时间
   */
  updateTime?: Date;
}
