export interface PostVO {
  /**
   * 岗位ID
   */
  id: number;
  /**
   * 岗位编码
   */
  code: string;
  /**
   * 岗位名称
   */
  name: string;
  /**
   * 岗位排序
   */
  sort: number;
  /**
   * 状态（0正常，1停用）
   */
  status: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
}

export interface PostListVO {
  /**
   * 岗位列表
   */
  list: PostVO[];
}
