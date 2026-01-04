import { request } from '@/utils';
import {
  LoginLogType,
  OperLogType,
  OnlineType,
  CacheModelType,
  CacheValueType,
  DelType,
} from '@/interface';
import { PageVO } from '@/types';
interface KeyType {
  key: string;
}
interface NameType {
  name: string;
}
// #region 登录日志接口
// 登录日志分页
export const getLoginLogApi = (params: any): Promise<PageVO<LoginLogType>> => {
  return request.get({ url: '/api/monitor/loginLog/page', params });
};
// 导出登录日志分页
export const exportLoginLogApi = (params: any): Promise<any> => {
  return request.get({ url: '/api/monitor/loginLog/export', params });
};
// 删除登录日志
export const delLoginLogApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/monitor/loginLog/${id}` });
};
// 批量删除登录日志
export const batchDelLoginLogApi = (ids: (number | string)[]): Promise<any> => {
  return request.delete({
    url: `/api/monitor/loginLog`,
    params: { ids: ids.join(',') },
  });
};
// 清空登录日志
export const clearLoginLogApi = (): Promise<any> => {
  return request.delete({ url: '/api/monitor/loginLog/clear' });
};
// #endregion 登录日志接口

// #region 操作日志接口
// 操作日志分页
export const getOperLogListApi = (
  params: any,
): Promise<PageVO<OperLogType>> => {
  return request.get({ url: '/api/monitor/operLog/page', params });
};
// 导出日志分页
export const exportOperLogApi = (params: any): Promise<any> => {
  return request.get({ url: '/api/monitor/operLog/export', params });
};

// 删除操作日志
export const delOperLogApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/monitor/operLog/${id}` });
};

// 批量删除操作日志
export const batchDelOperLogApi = (ids: (number | string)[]): Promise<any> => {
  return request.delete({
    url: `/api/monitor/operLog`,
    params: { ids: ids.join(',') },
  });
};

// 清空操作日志
export const clearOperLogApi = (): Promise<any> => {
  return request.delete({ url: '/api/monitor/operLog/clear' });
};
// #endregion 操作日志接口

//#region 在线用户接口
// 获取在线用户分页
export const getOnlineListApi = (params: any): Promise<PageVO<OnlineType>> => {
  return request.get({ url: '/api/monitor/online/page', params });
};
// 用户下线
export const delOnlineApi = (id: string): Promise<any> => {
  return request.delete({ url: `/api/monitor/online/${id}` });
};
// 批量下线用户
export const batchDelOnlineApi = (ids: string[]): Promise<any> => {
  return request.delete({
    url: `/api/monitor/online`,
    params: { ids: ids.join(',') },
  });
};
//#endregion 在线用户接口

// #region 缓存接口
// 获取缓存名称列表
export const getCacheListApi = (): Promise<CacheModelType[]> => {
  return request.get({ url: '/api/monitor/cache/getNames' });
};
// 通过名称获取获取缓存键名列表
export const getCacheKeyApi = (params: NameType): Promise<any[]> => {
  return request.get({ url: '/api/monitor/cache/getKeys', params });
};
// 通过键名获取缓存值
export const getCacheValueApi = (params: KeyType): Promise<CacheValueType> => {
  return request.get({ url: '/api/monitor/cache/value', params });
};
// 通过名称清除缓存
export const delCacheByNameApi = (params: NameType): Promise<any> => {
  return request.delete({ url: '/api/monitor/cache/clearName', params });
};
// 通过键名清除缓存
export const delCacheByKeyApi = (params: KeyType): Promise<any> => {
  return request.delete({ url: '/api/monitor/cache/clearKey', params });
};
// #endregion 缓存接口
