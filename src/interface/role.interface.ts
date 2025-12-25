export interface RoleVO {
  /**
   * 角色ID
   */
  id: number;
  /**
   * 角色名称
   */
  name: string;
  /**
   * 角色编码
   */
  code: string;
  /**
   * 角色排序
   */
  sort: number;
  /**
   * 数据范围（1全部数据权限，2自定义数据权限，3本部门数据权限，4本部门及以下数据权限）
   */
  dataScope: number;
  /**
   * 菜单树选择项是否关联显示（0不关联，1关联）
   */
  menuCheckStrictly: number;
  /**
   * 部门树选择项是否关联显示（0不关联，1关联）
   */
  deptCheckStrictly: number;
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

export interface RolePermissionVO {
  /**
   * 角色信息
   */
  role: RoleVO;
  /**
   * 菜单ID列表
   */
  menuIds: number[];
  /**
   * 部门ID列表
   */
  deptIds: number[];
}

export interface RoleListVO {
  /**
   * 角色列表
   */
  list: RoleVO[];
}
