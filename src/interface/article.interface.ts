export interface ArticleType {
  /**
   * 分类 1头条 2推荐 3轮播 4热门
   */
  attr?: string;
  /**
   * 作者
   */
  author?: string;
  /**
   * 栏目id
   */
  cid?: string;
  /**
   * 文章内容
   */
  content?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 文章简述
   */
  description?: string;
  /**
   * 主键
   */
  id?: number;
  /**
   * 缩略图
   */
  img?: string;
  /**
   * 外链
   */
  link?: string;
  /**
   * 浏览量
   */
  pv?: string;
  /**
   * seo描述
   */
  seo_description?: string;
  /**
   * seo关键字
   */
  seoKeywords?: string;
  /**
   * seo标题
   */
  seoTitle?: string;
  /**
   * 短标题
   */
  short_title?: string;
  /**
   * 来源
   */
  source?: string;
  /**
   * 状态 0 发布 1不发布
   */
  status?: string;
  /**
   * 其他栏目id
   */
  subCid?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 排序
   */
  sort?: number;
}
