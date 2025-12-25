export interface MenuVO {
  /**
   * 菜单ID
   */
  id: number;
  /**
   * 菜单名称
   */
  name: string;
  /**
   * 菜单路径
   */
  path: string;
  /**
   * 组件路径
   */
  component?: string;
  /**
   * 菜单类型（M目录，C菜单，F按钮）
   */
  type: string;
  /**
   * 权限标识
   */
  permission?: string;
  /**
   * 父菜单ID
   */
  parentId: number;
  /**
   * 排序
   */
  sort: number;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 是否可见（0可见，1隐藏）
   */
  visible: number;
  /**
   * 是否缓存（0缓存，1不缓存）
   */
  cache: number;
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

export interface MenuTreeVO {
  /**
   * 菜单ID
   */
  id: number;
  /**
   * 菜单名称
   */
  name: string;
  /**
   * 菜单路径
   */
  path: string;
  /**
   * 组件路径
   */
  component?: string;
  /**
   * 菜单类型（M目录，C菜单，F按钮）
   */
  type: string;
  /**
   * 权限标识
   */
  permission?: string;
  /**
   * 父菜单ID
   */
  parentId: number;
  /**
   * 排序
   */
  sort: number;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 是否可见（0可见，1隐藏）
   */
  visible: number;
  /**
   * 是否缓存（0缓存，1不缓存）
   */
  cache: number;
  /**
   * 状态（0正常，1停用）
   */
  status: number;
  /**
   * 子菜单
   */
  children?: MenuTreeVO[];
}

export interface MenuListVO {
  /**
   * 菜单列表
   */
  list: MenuVO[];
}
