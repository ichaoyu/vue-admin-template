import { DictTypeType, DictDataType, type DelType } from '@/interface';
import { request } from '@/utils';

//#region 字典类型
// 获取字典类型列表
export const getDictTypeListApi = (
  data: any,
): Promise<PageVO<DictTypeType>> => {
  return request.post({
    url: '/api/system/dict/type/page',
    data,
  });
};
// 添加字典类型
export const addDictTypeApi = (data: DictDataType): Promise<any> => {
  return request.post({ url: '/api/system/dict/type/create', data });
};
// 更新字典类型
export const updateDictTypeApi = (data: DictDataType): Promise<any> => {
  return request.put({
    url: `/api/system/dict/type/update`,
    data,
    params: { id: data.id },
  });
};
// 删除字典类型
export const delDictTypeApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/system/dict/type/delete', data });
};
// 获取字典类型
export const getDictTypeApi = (id: any): Promise<DictTypeType> => {
  return request.get({ url: '/api/system/dict/type', params: { id } });
};
// 导出字典类型分页
export const exportDictTypeListApi = (
  data: any,
): Promise<PageVO<DictTypeType>> => {
  return request.post({ url: '/api/system/dict/type/export', data });
};
//#endregion字典类型

//#region 字典数据
// 获取字典数据列表
export const getDictDataListApi = (
  data: any,
): Promise<PageVO<DictDataType>> => {
  return request.post({
    url: '/api/system/dict/data/page',
    data,
  });
};
// 添加字典数据
export const addDictDataApi = (data: DictDataType): Promise<any> => {
  return request.post({ url: '/api/system/dict/data/create', data });
};
// 更新字典数据
export const updateDictDataApi = (data: DictDataType): Promise<any> => {
  return request.put({
    url: `/api/system/dict/data/update`,
    data,
    params: { id: data.id },
  });
};
// 删除字典数据
export const delDictDataApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/system/dict/data/delete', data });
};
// 获取字典数据
export const getDictDataApi = (id: string): Promise<DictDataType> => {
  return request.get({ url: '/api/system/dict/data', params: { id } });
};
// 导出字典数据分页
export const exportDictDataListApi = (
  data: any,
): Promise<PageVO<DictDataType>> => {
  return request.post({ url: '/api/system/dict/data/export', data });
};
//#endregion 字典数据
