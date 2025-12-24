import request from '@/utils/axios';
import type { AxiosPromise } from 'axios';
import type { CreateArticleDto, UpdateArticleDto, QueryArticleDto, ArticleVO, ArticleListVO } from './types';

/**
 * 文章管理API
 */
export const articleApi = {
  /**
   * 创建文章
   * @param data 创建文章参数
   */
  createArticle: (data: CreateArticleDto): AxiosPromise<ArticleVO> => {
    return request({
      url: '/cms/article',
      method: 'post',
      data,
    });
  },

  /**
   * 查询文章列表
   * @param params 查询参数
   */
  getArticleList: (params?: QueryArticleDto): AxiosPromise<ArticleListVO> => {
    return request({
      url: '/cms/article',
      method: 'get',
      params,
    });
  },

  /**
   * 查询文章详情
   * @param id 文章ID
   */
  getArticleDetail: (id: string): AxiosPromise<ArticleVO> => {
    return request({
      url: `/cms/article/${id}`,
      method: 'get',
    });
  },

  /**
   * 更新文章
   * @param data 更新文章参数
   */
  updateArticle: (data: UpdateArticleDto): AxiosPromise<ArticleVO> => {
    return request({
      url: '/cms/article',
      method: 'put',
      data,
    });
  },

  /**
   * 删除文章
   * @param id 文章ID
   */
  deleteArticle: (id: string): AxiosPromise<{ success: boolean }> => {
    return request({
      url: `/cms/article/${id}`,
      method: 'delete',
    });
  },
};

export default articleApi;