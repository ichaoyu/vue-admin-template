import { request } from '@/utils';

import {
  SiteInfoType,
  FlinkType,
  DelType,
  TagType,
  MessageType,
  type ArticleType,
} from '@/interface';

//#region 网站配置
// 获取网站配置
export const getSiteInfoApi = (params: any): Promise<SiteInfoType> => {
  return request.get({ url: '/api/website/info/get', params });
};

// 更新网站配置
export const updateSiteInfoApi = (data: SiteInfoType): Promise<any> => {
  return request.put({
    url: `/api/website/info/update?id=${data.id}`,
    data,
  });
};
//#endregion网站配置

//#region 友情链接
// 获取友链列表
export const getFlinkListApi = (data: any): Promise<PageVO<FlinkType>> => {
  return request.post({ url: '/api/website/flink/list', data });
};

// 新增友情链接
export const addFlinkApi = (data: FlinkType): Promise<any> => {
  return request.post({ url: '/api/website/flink/add', data });
};

// 更新友情链接
export const updateFlinkApi = (data: FlinkType): Promise<any> => {
  return request.put({
    url: `/api/website/flink/update?id=${data.id}`,
    data,
  });
};

// 删除友链列表
export const delFlinkApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/website/flink/delete', data });
};
//#endregion友情链接

//#region 标签管理
// 获取标签列表
export const getTagListApi = (data: any): Promise<PageVO<TagType>> => {
  return request.post({ url: '/api/website/tag/list', data });
};

// 新增标签
export const addTagApi = (data: TagType): Promise<any> => {
  return request.post({ url: '/api/website/tag/add', data });
};

// 更新标签
export const updateTagApi = (data: TagType): Promise<any> => {
  return request.put({
    url: `/api/website/tag/update?id=${data.id}`,
    data,
  });
};

// 删除标签
export const delTagApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/website/tag/delete', data });
};
//#endregion标签管理

//#region 消息管理
// 获取消息列表分页
export const getMessageListApi = (data: any): Promise<PageVO<MessageType>> => {
  return request.post({ url: '/api/website/message/list', data });
};

// 删除消息
export const delMessageApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/website/message/delete', data });
};

//#endregion消息管理

//#region 文章管理
// 获取文章列表分页
export const getArticleListApi = (data: any): Promise<PageVO<ArticleType>> => {
  return request.post({ url: '/api/website/article/list', data });
};
// 删除文章
export const delArticleApi = (data: DelType): Promise<any> => {
  return request.delete({ url: '/api/website/article/delete', data });
};
// 新建文章
export const addArticleApi = (data: ArticleType): Promise<any> => {
  return request.post({ url: '/api/website/article/add', data });
};
// 更新文章
export const updateArticleApi = (data: ArticleType): Promise<any> => {
  return request.put({ url: '/api/website/article/update', data });
};
//#endregion文章管理
