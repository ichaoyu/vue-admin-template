import { request } from '@/utils';

// 配置列表
export const getConfigListApi = (data: any): Promise<IResponse<[]>> => {
  return request.post({ url: '/api/system/config/page', data });
};
