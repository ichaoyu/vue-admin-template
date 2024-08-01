export interface flinkType {
  /**
   * ID
   */
  id?: number;
  /**
   * 友链名称
   */
  title: string;
  /**
   * 链接
   */
  link: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 创建时间
   */
  createTime?: Date;

  /**
   * 更新时间
   */
  updateTime?: Date;
}
