import { request } from '@/utils';
import { PageVO } from '@/types';
import { ArticleType } from '@/interface';

/**
 * 文章管理API
 */
// 获取文章列表
export const getArticleListApi = (
  params: any,
): Promise<PageVO<ArticleType>> => {
  return request.get({ url: '/api/cms/article', params });
};

// 删除文章
export const delArticleApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/cms/article/${id}` });
};

// 新建文章
export const addArticleApi = (data: ArticleType): Promise<any> => {
  return request.post({ url: '/api/cms/article', data });
};

// 更新文章
export const updateArticleApi = (data: ArticleType): Promise<any> => {
  return request.put({ url: '/api/cms/article', data });
};

// 获取文章详情
export const getArticleDetailApi = (
  id: number | string,
): Promise<ArticleType> => {
  return request.get({ url: `/api/cms/article/${id}` });
};
