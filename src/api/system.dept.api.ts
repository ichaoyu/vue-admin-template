import { request } from '@/utils';
import { DeptListVO, DeptTreeVO, DeptVO } from '@/interface/dept.interface';

// #region 部门管理接口
// 获取部门列表
export const getDeptListApi = (): Promise<DeptListVO> => {
  return request.get({ url: '/api/system/dept' });
};

// 获取部门树结构
export const getDeptTreeApi = (): Promise<DeptTreeVO[]> => {
  return request.get({ url: '/api/system/dept/tree' });
};

// 获取部门详情
export const getDeptDetailApi = (id: number | string): Promise<DeptVO> => {
  return request.get({ url: `/api/system/dept/${id}` });
};

// 创建部门
export const createDeptApi = (data: any): Promise<DeptVO> => {
  return request.post({ url: '/api/system/dept', data });
};

// 更新部门
export const updateDeptApi = (
  id: number | string,
  data: any,
): Promise<DeptVO> => {
  return request.put({ url: `/api/system/dept/${id}`, data });
};

// 删除部门
export const deleteDeptApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/system/dept/${id}` });
};
// #endregion 部门管理接口
