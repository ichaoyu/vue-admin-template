import { request } from '@/utils';
import {
  LoginLogType,
  operLogType,
  OnlineInfoType,
  CacheModelType,
} from '@/interface';
interface KeyType {
  key: string;
}
interface NameType {
  name: string;
}
// #region 登录日志接口
// 登录日志分页
export const getLoginLogApi = (
  params: any,
): Promise<IResponse<LoginLogType>> => {
  return request.post({ url: '/api/monitor/loginLog/page', params });
};
// 导出登录日志分页
export const exportLoginLogApi = (
  params: any,
): Promise<IResponse<LoginLogType>> => {
  return request.post({ url: '/api/monitor/loginLog/export', params });
};
// 删除登录日志
// 无参数则是清空日志
export const delLoginLogApi = (
  params: any,
): Promise<IResponse<LoginLogType>> => {
  return request.post({ url: '/api/monitor/loginLog/delete', params });
};
// #endregion 登录日志接口

// #region 操作日志接口
// 操作日志分页
export const getOperLogApi = (params: any): Promise<IResponse<operLogType>> => {
  return request.post({ url: '/api/monitor/operLog/page', params });
};
// 导出日志分页
export const exportOperLogApi = (
  params: any,
): Promise<IResponse<operLogType>> => {
  return request.post({ url: '/api/monitor/operLog/export', params });
};

// 删除操作日志
// 无参数则是清空日志
export const delOperLogApi = (
  params: string[] | null,
): Promise<IResponse<string>> => {
  return request.delete({ url: '/api/monitor/operLog/delete', params });
};
// #endregion 登录日志接口

//#region 在线用户接口
// 获取在线用户分页
export const getOnlineApi = (
  params: string[] | null,
): Promise<IResponse<OnlineInfoType>> => {
  return request.post({ url: '/api/monitor/online/page', params });
};
// 用户下线
export const delOnlineApi = (
  params: string[] | null,
): Promise<IResponse<any>> => {
  return request.delete({ url: '/api/monitor/online', params });
};
//#endregion 在线用户接口

// #region 缓存接口
// 获取缓存名称列表
export const getCacheListApi = (): Promise<IResponse<CacheModelType>> => {
  return request.get({ url: '/api/monitor/cache/getNames' });
};
// 通过名称获取获取缓存键名列表
export const getCacheKeyApi = (
  params: NameType,
): Promise<IResponse<CacheModelType>> => {
  return request.get({ url: '/api/monitor/cache/getKeys', params });
};
// 通过名称清除缓存
export const delCacheByNameApi = (
  params: NameType,
): Promise<IResponse<any>> => {
  return request.delete({ url: '/api/monitor/cache/clearName', params });
};
// 通过键名获取缓存值
export const getCacheValueApi = (
  params: KeyType,
): Promise<IResponse<CacheModelType>> => {
  return request.get({ url: '/api/monitor/cache/value', params });
};
// 通过键名清除缓存
export const delCacheByKeyApi = (params: KeyType): Promise<IResponse<any>> => {
  return request.delete({ url: '/api/monitor/cache/clearKey', params });
};
// #endregion 缓存接口
