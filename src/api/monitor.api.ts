import { request } from '@/utils';
import {
  LoginLogType,
  OperLogType,
  OnlineInfoType,
  CacheModelType,
  DelType,
} from '@/interface';
interface KeyType {
  key: string;
}
interface NameType {
  name: string;
}
// #region 登录日志接口
// 登录日志分页
export const getLoginLogApi = (data: any): Promise<PageVO<LoginLogType>> => {
  return request.post({ url: '/api/monitor/loginLog/page', data });
};
// 导出登录日志分页
export const exportLoginLogApi = (data: any): Promise<PageVO<LoginLogType>> => {
  return request.post({ url: '/api/monitor/loginLog/export', data });
};
// 删除登录日志
export const delLoginLogApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/monitor/loginLog/delete', data });
};
// 清空登录日志
export const clearLoginLogApi = (): Promise<any> => {
  return request.delete({ url: '/api/monitor/loginLog/clear' });
};
// #endregion 登录日志接口

// #region 操作日志接口
// 操作日志分页
export const getOperLogListApi = (data: any): Promise<PageVO<OperLogType>> => {
  return request.post({ url: '/api/monitor/operLog/page', data });
};
// 导出日志分页
export const exportOperLogApi = (data: any): Promise<PageVO<OperLogType>> => {
  return request.post({ url: '/api/monitor/operLog/export', data });
};

// 删除操作日志
export const delOperLogApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/monitor/operLog/delete', data });
};
// 清空登录日志
export const clearOperLogApi = (): Promise<any> => {
  return request.delete({ url: '/api/monitor/operLog/clear' });
};
// #endregion 登录日志接口

//#region 在线用户接口
// 获取在线用户分页
export const getOnlineApi = (
  params: string[] | null,
): Promise<PageVO<OnlineInfoType>> => {
  return request.post({ url: '/api/monitor/online/page', params });
};
// 用户下线
export const delOnlineApi = (params: string[] | null): Promise<any> => {
  return request.delete({ url: '/api/monitor/online', params });
};
//#endregion 在线用户接口

// #region 缓存接口
// 获取缓存名称列表
export const getCacheListApi = (): Promise<CacheModelType> => {
  return request.get({ url: '/api/monitor/cache/getNames' });
};
// 通过名称获取获取缓存键名列表
export const getCacheKeyApi = (params: NameType): Promise<CacheModelType> => {
  return request.get({ url: '/api/monitor/cache/getKeys', params });
};
// 通过名称清除缓存
export const delCacheByNameApi = (params: NameType): Promise<any> => {
  return request.delete({ url: '/api/monitor/cache/clearName', params });
};
// 通过键名获取缓存值
export const getCacheValueApi = (params: KeyType): Promise<CacheModelType> => {
  return request.get({ url: '/api/monitor/cache/value', params });
};
// 通过键名清除缓存
export const delCacheByKeyApi = (params: KeyType): Promise<any> => {
  return request.delete({ url: '/api/monitor/cache/clearKey', params });
};
// #endregion 缓存接口
