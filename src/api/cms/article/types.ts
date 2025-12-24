// 文章管理相关类型定义

// 创建文章请求参数
export interface CreateArticleDto {
  cid: number;
  subCid?: string;
  title: string;
  shortTitle?: string;
  tagId?: string;
  attr?: string;
  articleView?: string;
  source?: string;
  author?: string;
  description?: string;
  img?: string;
  content: string;
  status?: number;
  pv?: number;
  link?: string;
}

// 更新文章请求参数
export interface UpdateArticleDto extends CreateArticleDto {
  id: string;
}

// 查询文章列表请求参数
export interface QueryArticleDto {
  cid?: number;
  title?: string;
  status?: number;
  page?: number;
  pageSize?: number;
}

// 文章详情响应
export interface ArticleVO {
  id: string;
  cid: number;
  subCid?: string;
  title: string;
  shortTitle?: string;
  tagId?: string;
  attr?: string;
  articleView?: string;
  source?: string;
  author?: string;
  description?: string;
  img?: string;
  content: string;
  status: number;
  pv: number;
  link?: string;
  createTime: string;
  updateTime: string;
}

// 文章列表响应
export interface ArticleListVO {
  list: ArticleVO[];
  total: number;
  page: number;
  pageSize: number;
}