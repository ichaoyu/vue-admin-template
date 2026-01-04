import { request } from '@/utils';
import { PageVO } from '@/types';
import { CategoryType } from '@/interface';

/**
 * 分类管理API
 */
// 获取分类列表
export const getCategoryListApi = (
  params: any,
): Promise<PageVO<CategoryType>> => {
  console.log('params: ', params);
  return request.get({ url: '/api/cms/category', params });
};

// 删除分类
export const delCategoryApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/cms/category/${id}` });
};

// 新建分类
export const addCategoryApi = (data: CategoryType): Promise<any> => {
  return request.post({ url: '/api/cms/category', data });
};

// 更新分类
export const updateCategoryApi = (data: CategoryType): Promise<any> => {
  return request.put({ url: '/api/cms/category', data });
};

// 获取分类详情
export const getCategoryDetailApi = (
  id: number | string,
): Promise<CategoryType> => {
  return request.get({ url: `/api/cms/category/${id}` });
};
