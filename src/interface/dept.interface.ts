export interface DeptVO {
  /**
   * 部门ID
   */
  id: number;
  /**
   * 部门名称
   */
  name: string;
  /**
   * 父部门ID
   */
  parentId: number;
  /**
   * 部门排序
   */
  sort: number;
  /**
   * 负责人
   */
  leader?: string;
  /**
   * 联系电话
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
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

export interface DeptTreeVO {
  /**
   * 部门ID
   */
  id: number;
  /**
   * 部门名称
   */
  name: string;
  /**
   * 父部门ID
   */
  parentId: number;
  /**
   * 部门排序
   */
  sort: number;
  /**
   * 负责人
   */
  leader?: string;
  /**
   * 联系电话
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 状态（0正常，1停用）
   */
  status: number;
  /**
   * 子部门
   */
  children?: DeptTreeVO[];
}

export interface DeptListVO {
  /**
   * 部门列表
   */
  list: DeptVO[];
}
