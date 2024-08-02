import { request } from '@/utils';
import {
  UserLoginType,
  RoleParams,
  UserState,
  Captcha,
  type userInfo,
} from '@/interface/user.interface';

// #region 验证接口
// 验证码
export const verifyCodeApi = (): Promise<Captcha> => {
  return request.get({ url: '/api/auth/captcha' });
};
// 登录
export const loginApi = (data: UserLoginType): Promise<any> => {
  return request.post({ url: '/api/auth/login', data });
};
// 退出登录
export const loginOutApi = (): Promise<any> => {
  return request.post({ url: '/api/auth/logout' });
};
// #endregion 验证接口

//#region 当前用户信息接口
// 获取当前用户信息
export const getUserInfoApi = (): Promise<UserState> => {
  return request.get({ url: '/api/current-user/getInfo' });
};
// 获取用户配置接口
export const getUserProfileApi = (): Promise<UserState> => {
  return request.get({ url: '/api/current-user/getProfile' });
};
// 更新用户基本信息
export const updateUserInfoApi = (): Promise<UserState> => {
  return request.get({ url: '/api/current-user/updateBase' });
};
// 更新用户密码
export const updateUserPwdApi = (): Promise<UserState> => {
  return request.get({ url: '/api/current-user/updatePassword' });
};
//#endregion 当前用户信息接口

// 用户列表
export const getUserListApi = (data: any): Promise<PageVO<userInfo>> => {
  return request.post({ url: '/api/system/user/page', data });
};

export const getAdminRoleApi = (
  params: RoleParams,
): Promise<AppCustomRouteRecordRaw[]> => {
  return request.get({ url: '/api/role/list', params });
};
