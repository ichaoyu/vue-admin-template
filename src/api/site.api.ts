import { request } from '@/utils';

import { siteInfoType, flinkType, DelType } from '@/interface';

// 获取网站配置
export const getSiteInfoApi = (params: any): Promise<siteInfoType> => {
  return request.get({ url: '/api/website/info/get', params });
};

// 更新网站配置
export const updateSiteInfoApi = (data: siteInfoType): Promise<any> => {
  return request.put({
    url: `/api/website/info/update?id=${data.id}`,
    data,
  });
};

// 获取友链列表
export const getFlinkListApi = (data: any): Promise<PageVO<flinkType>> => {
  return request.post({ url: '/api/website/flink/list', data });
};

// 新增友情链接
export const addFlinkApi = (data: flinkType): Promise<any> => {
  return request.post({ url: '/api/website/flink/add', data });
};

// 更新友情链接
export const updateFlinkApi = (data: flinkType): Promise<any> => {
  return request.put({
    url: `/api/website/flink/update?id=${data.id}`,
    data,
  });
};

// 删除友链列表
export const delFlinkApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/website/flink/delete', data });
};
