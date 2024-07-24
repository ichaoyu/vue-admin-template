import { request } from '@/utils';

import { siteInfoType } from '@/interface';

// 获取网站配置
export const getSiteInfoApi = (
  params: any,
): Promise<IResponse<siteInfoType>> => {
  return request.get({ url: '/api/website/info/get', params });
};

// 更新网站配置
export const updateSiteInfoApi = (
  data: siteInfoType,
): Promise<IResponse<any>> => {
  return request.put({
    url: `/api/website/info/update?id=${data.id}`,
    data,
  });
};
