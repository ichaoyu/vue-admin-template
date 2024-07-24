import { request } from '@/utils';
import {
  UserLoginType,
  RoleParams,
  UserState,
  Captcha,
} from '@/interface/user.interface';

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
// 当前用户信息
export const getUserInfoApi = (): Promise<IResponse<UserState>> => {
  return request.get({ url: '/api/current-user/getInfo' });
};

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
