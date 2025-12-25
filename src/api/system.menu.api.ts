import { request } from '@/utils';
import { MenuListVO, MenuTreeVO, MenuVO } from '@/interface/menu.interface';

// #region 菜单管理接口
// 获取菜单列表
export const getMenuListApi = (): Promise<MenuListVO> => {
  return request.get({ url: '/api/system/menu' });
};

// 获取菜单树结构
export const getMenuTreeApi = (): Promise<MenuTreeVO[]> => {
  return request.get({ url: '/api/system/menu/tree' });
};

// 获取菜单详情
export const getMenuDetailApi = (id: number | string): Promise<MenuVO> => {
  return request.get({ url: `/api/system/menu/${id}` });
};

// 创建菜单
export const createMenuApi = (data: any): Promise<MenuVO> => {
  return request.post({ url: '/api/system/menu', data });
};

// 更新菜单
export const updateMenuApi = (id: number | string, data: any): Promise<MenuVO> => {
  return request.put({ url: `/api/system/menu/${id}`, data });
};

// 删除菜单
export const deleteMenuApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/system/menu/${id}` });
};
// #endregion 菜单管理接口
