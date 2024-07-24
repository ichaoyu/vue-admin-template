import { request } from '@/utils';

// 获取字典数据列表
export const getDictListApi = (data: any): Promise<IResponse<[]>> => {
  return request.post({
    url: '/api/system/dict/data/page',
    data,
  });
};

// 获取字典类型列表
export const getDictTypeListApi = (data: any): Promise<IResponse<[]>> => {
  return request.post({
    url: '/api/system/dict/type/page',
    data,
  });
};
