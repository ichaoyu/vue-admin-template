import request from '@/utils/axios';
import type { AxiosPromise } from 'axios';
import type { CreateCategoryDto, UpdateCategoryDto, QueryCategoryDto, CategoryVO, CategoryListVO } from './types';

/**
 * 分类管理API
 */
export const categoryApi = {
  /**
   * 创建分类
   * @param data 创建分类参数
   */
  createCategory: (data: CreateCategoryDto): AxiosPromise<CategoryVO> => {
    return request({
      url: '/cms/category',
      method: 'post',
      data,
    });
  },

  /**
   * 查询分类列表
   * @param params 查询参数
   */
  getCategoryList: (params?: QueryCategoryDto): AxiosPromise<CategoryListVO> => {
    return request({
      url: '/cms/category',
      method: 'get',
      params,
    });
  },

  /**
   * 查询分类详情
   * @param id 分类ID
   */
  getCategoryDetail: (id: string): AxiosPromise<CategoryVO> => {
    return request({
      url: `/cms/category/${id}`,
      method: 'get',
    });
  },

  /**
   * 更新分类
   * @param data 更新分类参数
   */
  updateCategory: (data: UpdateCategoryDto): AxiosPromise<CategoryVO> => {
    return request({
      url: '/cms/category',
      method: 'put',
      data,
    });
  },

  /**
   * 删除分类
   * @param id 分类ID
   */
  deleteCategory: (id: string): AxiosPromise<{ success: boolean }> => {
    return request({
      url: `/cms/category/${id}`,
      method: 'delete',
    });
  },

  /**
   * 查询分类树
   * @param params 查询参数
   */
  getCategoryTree: (params?: { modelId?: number; status?: number }): AxiosPromise<CategoryVO[]> => {
    return request({
      url: '/cms/category/tree',
      method: 'get',
      params,
    });
  },
};

export default categoryApi;