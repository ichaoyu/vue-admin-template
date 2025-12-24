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
  const res = request.get({ url: '/api/captcha' });
  console.log('res: ', res);
  return res;
};
// 登录
export const loginApi = (data: UserLoginType): Promise<any> => {
  return request.post({ url: '/api/login', data });
};
// 退出登录
export const loginOutApi = (): Promise<any> => {
  return request.post({ url: '/api/logout' });
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

// 新增用户
export const addUserApi = (data: any): Promise<any> => {
  return request.post({ url: '/api/system/user/add', data });
};

// 编辑用户
export const editUserApi = (data: any): Promise<any> => {
  return request.put({ url: '/api/system/user/edit', data });
};

// 删除用户
export const deleteUserApi = (id: number): Promise<any> => {
  return request.delete({ url: `/api/system/user/delete/${id}` });
};

// 批量删除用户
export const batchDeleteUserApi = (data: { ids: number[] }): Promise<any> => {
  return request.delete({ url: '/api/system/user/batchDelete', data });
};

// 修改用户状态
export const changeUserStatusApi = (data: {
  id: number;
  status: number;
}): Promise<any> => {
  return request.put({ url: '/api/system/user/changeStatus', data });
};

// 获取用户角色列表
export const getUserRoleListApi = (
  params: RoleParams,
): Promise<AppCustomRouteRecordRaw[]> => {
  return request.get({ url: '/api/role/list', params });
};

// 获取用户分配的角色
export const getUserRoleApi = (userId: number): Promise<any> => {
  return request.get({ url: `/api/system/user/role/${userId}` });
};

// 分配用户角色
export const assignUserRoleApi = (data: {
  userId: number;
  roleIds: number[];
}): Promise<any> => {
  return request.post({ url: '/api/system/user/assignRole', data });
};

// 获取部门列表
export const getDeptListApi = (): Promise<any> => {
  return request.get({ url: '/api/system/dept/list' });
};
