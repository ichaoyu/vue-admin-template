import { request } from '@/utils';
import {
  UserLoginType,
  RoleParams,
  UserState,
} from '@/interface/user.interface';

export const loginApi = (
  data: UserLoginType,
): Promise<IResponse<UserState>> => {
  return request.post({ url: '/api/user/login', data });
};
export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/api/user/loginOut' });
};

export const getAdminRoleApi = (
  params: RoleParams,
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/api/role/list', params });
};

export const getUserListApi = (
  data: any,
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.post({ url: '/api/user/list', data });
};
