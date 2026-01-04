export interface CategoryType {
  /**
   * 分类ID
   */
  id?: number;
  /**
   * 分类名称
   */
  name: string;
  /**
   * 父分类ID
   */
  parentId: number;
  /**
   * 分类排序
   */
  sort: number;
  /**
   * 分类图标
   */
  icon?: string;
  /**
   * 分类描述
   */
  description?: string;
  /**
   * 分类状态（0正常，1停用）
   */
  status: number;
  /**
   * 分类路径
   */
  path?: string;
  /**
   * 分类层级
   */
  level?: number;
  /**
   * 是否为叶子节点
   */
  isLeaf?: boolean;
  /**
   * 创建时间
   */
  createdAt?: string;
  /**
   * 更新时间
   */
  updatedAt?: string;
}
