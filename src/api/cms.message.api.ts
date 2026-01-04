import { request } from '@/utils';
import { PageVO } from '@/types';
import { MessageType } from '@/interface';

/**
 * 消息管理API
 */
// 获取消息列表
export const getMessageListApi = (
  params: any,
): Promise<PageVO<MessageType>> => {
  return request.get({ url: '/api/cms/message', params });
};

// 删除消息
export const delMessageApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/cms/message/${id}` });
};

// 新建消息
export const addMessageApi = (data: MessageType): Promise<any> => {
  return request.post({ url: '/api/cms/message', data });
};

// 更新消息
export const updateMessageApi = (data: MessageType): Promise<any> => {
  return request.put({ url: '/api/cms/message', data });
};

// 获取消息详情
export const getMessageDetailApi = (
  id: number | string,
): Promise<MessageType> => {
  return request.get({ url: `/api/cms/message/${id}` });
};

// 回复消息 - 这个API在NestJS后端没有找到，暂时保留原路径
export const replyMessageApi = (data: {
  id: number | string;
  reply: string;
}): Promise<any> => {
  return request.put({ url: '/api/cms/message/reply', data });
};
