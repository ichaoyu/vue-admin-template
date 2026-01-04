import { DictTypeType, DictDataType, type DelType } from '@/interface';
import { request } from '@/utils';
import { PageVO } from '@/types';

//#region 字典类型
// 获取字典类型列表
export const getDictTypeListApi = (): Promise<any> => {
  return request.get({ url: '/api/system/dict/type' });
};

// 添加字典类型
export const addDictTypeApi = (data: DictTypeType): Promise<any> => {
  return request.post({ url: '/api/system/dict/type', data });
};

// 更新字典类型
export const updateDictTypeApi = (
  id: number | string,
  data: DictTypeType,
): Promise<any> => {
  return request.put({ url: `/api/system/dict/type/${id}`, data });
};

// 删除字典类型
export const delDictTypeApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/system/dict/type/${id}` });
};

// 批量删除字典类型
export const batchDelDictTypeApi = (ids: (number | string)[]): Promise<any> => {
  return request.delete({
    url: `/api/system/dict/type`,
    params: { ids: ids.join(',') },
  });
};

// 获取字典类型详情
export const getDictTypeApi = (id: number | string): Promise<DictTypeType> => {
  return request.get({ url: `/api/system/dict/type/${id}` });
};

// 导出字典类型分页
export const exportDictTypeListApi = (): Promise<any> => {
  return request.post({ url: '/api/system/dict/type/export' });
};
//#endregion字典类型

//#region 字典数据
// 获取字典数据列表
export const getDictDataListApi = (): Promise<any> => {
  return request.get({ url: '/api/system/dict/data' });
};

// 根据字典类型获取字典数据
export const getDictDataByTypeApi = (
  dictType: string,
): Promise<DictDataType[]> => {
  return request.get({ url: `/api/system/dict/data/type/${dictType}` });
};

// 添加字典数据
export const addDictDataApi = (data: DictDataType): Promise<any> => {
  return request.post({ url: '/api/system/dict/data', data });
};

// 更新字典数据
export const updateDictDataApi = (
  id: number | string,
  data: DictDataType,
): Promise<any> => {
  return request.put({ url: `/api/system/dict/data/${id}`, data });
};

// 删除字典数据
export const delDictDataApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/system/dict/data/${id}` });
};

// 批量删除字典数据
export const batchDelDictDataApi = (ids: (number | string)[]): Promise<any> => {
  return request.delete({
    url: `/api/system/dict/data`,
    params: { ids: ids.join(',') },
  });
};

// 获取字典数据详情
export const getDictDataApi = (id: number | string): Promise<DictDataType> => {
  return request.get({ url: `/api/system/dict/data/${id}` });
};

// 导出字典数据分页
export const exportDictDataListApi = (): Promise<any> => {
  return request.post({ url: '/api/system/dict/data/export' });
};
//#endregion 字典数据
