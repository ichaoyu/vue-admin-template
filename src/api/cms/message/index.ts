import request from '@/utils/axios';
import type { AxiosPromise } from 'axios';
import type { CreateMessageDto, UpdateMessageDto, QueryMessageDto, MessageVO, MessageListVO } from './types';

/**
 * 消息管理API
 */
export const messageApi = {
  /**
   * 创建消息
   * @param data 创建消息参数
   */
  createMessage: (data: CreateMessageDto): AxiosPromise<MessageVO> => {
    return request({
      url: '/cms/message',
      method: 'post',
      data,
    });
  },

  /**
   * 查询消息列表
   * @param params 查询参数
   */
  getMessageList: (params?: QueryMessageDto): AxiosPromise<MessageListVO> => {
    return request({
      url: '/cms/message',
      method: 'get',
      params,
    });
  },

  /**
   * 查询消息详情
   * @param id 消息ID
   */
  getMessageDetail: (id: string): AxiosPromise<MessageVO> => {
    return request({
      url: `/cms/message/${id}`,
      method: 'get',
    });
  },

  /**
   * 更新消息
   * @param data 更新消息参数
   */
  updateMessage: (data: UpdateMessageDto): AxiosPromise<MessageVO> => {
    return request({
      url: '/cms/message',
      method: 'put',
      data,
    });
  },

  /**
   * 删除消息
   * @param id 消息ID
   */
  deleteMessage: (id: string): AxiosPromise<{ success: boolean }> => {
    return request({
      url: `/cms/message/${id}`,
      method: 'delete',
    });
  },

  /**
   * 批量删除消息
   * @param ids 消息ID数组
   */
  batchDeleteMessage: (ids: string[]): AxiosPromise<{ success: boolean }> => {
    return request({
      url: '/cms/message/batch',
      method: 'delete',
      data: { ids },
    });
  },

  /**
   * 标记消息为已读
   * @param id 消息ID
   */
  markMessageAsRead: (id: string): AxiosPromise<{ success: boolean }> => {
    return request({
      url: `/cms/message/${id}/read`,
      method: 'put',
    });
  },

  /**
   * 批量标记消息为已读
   * @param ids 消息ID数组
   */
  batchMarkMessageAsRead: (ids: string[]): AxiosPromise<{ success: boolean }> => {
    return request({
      url: '/cms/message/batch/read',
      method: 'put',
      data: { ids },
    });
  },
};

export default messageApi;