import { request } from '@/utils';
import {
  RoleListVO,
  RolePermissionVO,
  RoleVO,
} from '@/interface/role.interface';

// #region 角色管理接口
// 获取角色列表
export const getRoleListApi = (): Promise<RoleListVO> => {
  return request.get({ url: '/api/system/role' });
};

// 获取角色详情
export const getRoleDetailApi = (
  id: number | string,
): Promise<RolePermissionVO> => {
  return request.get({ url: `/api/system/role/${id}` });
};

// 创建角色
export const createRoleApi = (data: any): Promise<RoleVO> => {
  return request.post({ url: '/api/system/role', data });
};

// 更新角色
export const updateRoleApi = (
  id: number | string,
  data: any,
): Promise<RoleVO> => {
  return request.put({ url: `/api/system/role/${id}`, data });
};

// 删除角色
export const deleteRoleApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/system/role/${id}` });
};

// 批量删除角色
export const batchDeleteRoleApi = (ids: (number | string)[]): Promise<any> => {
  return request.delete({
    url: '/api/system/role',
    params: { ids: ids.join(',') },
  });
};
// #endregion 角色管理接口
