export interface CacheModelType {
  /**
   * 缓存名称
   */
  cacheName: string;
  /**
   * 备注
   */
  remark: string;
}

export interface CacheValueType {
  /**
   * 缓存名称
   */
  cacheName: string;
  /**
   * 缓存键名
   */
  cacheKey: string;
  /**
   * 缓存内容
   */
  cacheValue: string;
}
