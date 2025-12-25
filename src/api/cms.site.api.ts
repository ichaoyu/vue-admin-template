import { request } from '@/utils';
import { PageVO } from '@/types';
import { SiteInfoType } from '@/interface';

/**
 * 站点管理API
 */
// 获取网站配置列表
export const getSiteListApi = (params: any): Promise<PageVO<SiteInfoType>> => {
  return request.get({ url: '/api/cms/site', params });
};

// 获取网站配置详情
export const getSiteInfoApi = (id: number | string): Promise<SiteInfoType> => {
  return request.get({ url: `/api/cms/site/${id}` });
};

// 创建网站配置
export const createSiteInfoApi = (data: SiteInfoType): Promise<SiteInfoType> => {
  return request.post({ url: '/api/cms/site', data });
};

// 更新网站配置
export const updateSiteInfoApi = (data: SiteInfoType): Promise<any> => {
  return request.put({ url: '/api/cms/site', data });
};

// 删除网站配置
export const deleteSiteInfoApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/cms/site/${id}` });
};

// 获取站点统计信息 - 非标准API，保留原路径
export const getSiteStatsApi = (): Promise<any> => {
  return request.get({ url: '/api/cms/site/stats' });
};

// 清理站点缓存 - 非标准API，保留原路径
export const clearSiteCacheApi = (): Promise<any> => {
  return request.post({ url: '/api/cms/site/clear-cache' });
};