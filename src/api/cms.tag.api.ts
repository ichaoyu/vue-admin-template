import { request } from '@/utils';
import { PageVO } from '@/types';
import { TagType } from '@/interface';

/**
 * 标签管理API
 */
// 获取标签列表
export const getTagListApi = (params: any): Promise<PageVO<TagType>> => {
  return request.get({ url: '/api/cms/tag', params });
};

// 删除标签
export const delTagApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/cms/tag/${id}` });
};

// 新建标签
export const addTagApi = (data: TagType): Promise<any> => {
  return request.post({ url: '/api/cms/tag', data });
};

// 更新标签
export const updateTagApi = (data: TagType): Promise<any> => {
  return request.put({ url: '/api/cms/tag', data });
};

// 获取标签详情
export const getTagDetailApi = (id: number | string): Promise<TagType> => {
  return request.get({ url: `/api/cms/tag/${id}` });
};
