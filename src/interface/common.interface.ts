/**
 * 删除参数类型
 */
export interface DeleteParams {
  /**
   * 要删除的ID列表
   */
  ids: number[] | string[];
}

/**
 * ID参数类型
 */
export interface IdParams {
  /**
   * ID值
   */
  id: number | string;
}
