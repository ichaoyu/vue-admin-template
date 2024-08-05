import { request } from '@/utils';

import { siteInfoType, flinkType, DelType, tagType } from '@/interface';

//#region 网站配置
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
//#endregion网站配置

//#region 友情链接
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
//#endregion友情链接

//#region 标签管理
// 获取标签列表
export const getTagListApi = (data: any): Promise<PageVO<tagType>> => {
  return request.post({ url: '/api/website/tag/list', data });
};

// 新增标签
export const addTagApi = (data: tagType): Promise<any> => {
  return request.post({ url: '/api/website/tag/add', data });
};

// 更新标签
export const updateTagApi = (data: tagType): Promise<any> => {
  return request.put({
    url: `/api/website/tag/update?id=${data.id}`,
    data,
  });
};

// 删除标签
export const delTagApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/website/tag/delete', data });
};
//#endregion标签管理
