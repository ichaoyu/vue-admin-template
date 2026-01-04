import { request } from '@/utils';
import { PageVO } from '@/types';
import { FlinkType } from '@/interface';

/**
 * 友情链接管理API
 */
// 获取友情链接列表
export const getFriendlinkListApi = (
  params: any,
): Promise<PageVO<FlinkType>> => {
  return request.get({ url: '/api/cms/friendlink', params });
};

// 删除友情链接
export const delFriendlinkApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/cms/friendlink/${id}` });
};

// 新建友情链接
export const addFriendlinkApi = (data: FlinkType): Promise<any> => {
  return request.post({ url: '/api/cms/friendlink', data });
};

// 更新友情链接
export const updateFriendlinkApi = (data: FlinkType): Promise<any> => {
  return request.put({ url: '/api/cms/friendlink', data });
};

// 获取友情链接详情
export const getFriendlinkDetailApi = (
  id: number | string,
): Promise<FlinkType> => {
  return request.get({ url: `/api/cms/friendlink/${id}` });
};
