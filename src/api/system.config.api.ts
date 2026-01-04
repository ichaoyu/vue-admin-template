import { request } from '@/utils';
import { IResponse, PageVO } from '@/types';

/**
 * 系统配置API
 */
// 获取配置列表
export const getConfigListApi = (): Promise<any> => {
  return request.get({ url: '/api/system/config' });
};

// 根据ID获取配置详情
export const getConfigByIdApi = (id: number | string): Promise<any> => {
  return request.get({ url: `/api/system/config/${id}` });
};

// 根据配置键名获取配置
export const getConfigByKeyApi = (configKey: string): Promise<any> => {
  return request.get({ url: `/api/system/config/key/${configKey}` });
};

// 创建配置
export const createConfigApi = (data: any): Promise<any> => {
  return request.post({ url: '/api/system/config', data });
};

// 更新配置
export const updateConfigApi = (
  id: number | string,
  data: any,
): Promise<any> => {
  return request.put({ url: `/api/system/config/${id}`, data });
};

// 删除配置
export const deleteConfigApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/system/config/${id}` });
};
