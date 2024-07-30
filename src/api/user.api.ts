import { request } from '@/utils';
import {
  UserLoginType,
  RoleParams,
  UserState,
  Captcha,
} from '@/interface/user.interface';

// #region 验证接口
// 验证码
export const verifyCodeApi = (): Promise<IResponse<Captcha>> => {
  return request.get({ url: '/api/auth/captcha' });
};
// 登录
export const loginApi = (data: UserLoginType): Promise<IResponse<string>> => {
  return request.post({ url: '/api/auth/login', data });
};
// 退出登录
export const loginOutApi = (): Promise<IResponse<null>> => {
  return request.post({ url: '/api/auth/logout' });
};
// #endregion 验证接口

//#region 当前用户信息接口
// 获取当前用户信息
export const getUserInfoApi = (): Promise<IResponse<UserState>> => {
  return request.get({ url: '/api/current-user/getInfo' });
};
// 获取用户配置接口
export const getUserProfileApi = (): Promise<IResponse<UserState>> => {
  return request.get({ url: '/api/current-user/getProfile' });
};
// 更新用户基本信息
export const updateUserInfoApi = (): Promise<IResponse<UserState>> => {
  return request.get({ url: '/api/current-user/updateBase' });
};
// 更新用户密码
export const updateUserPwdApi = (): Promise<IResponse<UserState>> => {
  return request.get({ url: '/api/current-user/updatePassword' });
};
//#endregion 当前用户信息接口

export const getAdminRoleApi = (
  params: RoleParams,
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/api/role/list', params });
};

// 用户列表
export const getUserListApi = (
  data: any,
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.post({ url: '/api/system/user/page', data });
};
