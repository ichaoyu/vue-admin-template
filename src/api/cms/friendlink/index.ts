import request from '@/utils/axios';
import type { AxiosPromise } from 'axios';
import type { CreateFriendlinkDto, UpdateFriendlinkDto, QueryFriendlinkDto, FriendlinkVO, FriendlinkListVO } from './types';

/**
 * 朋友链接API
 */
export const friendlinkApi = {
  /**
   * 创建朋友链接
   * @param data 创建参数
   */
  createFriendlink: (data: CreateFriendlinkDto): AxiosPromise<FriendlinkVO> => {
    return request({
      url: '/cms/friendlink',
      method: 'post',
      data,
    });
  },

  /**
   * 查询朋友链接列表
   * @param params 查询参数
   */
  getFriendlinkList: (params?: QueryFriendlinkDto): AxiosPromise<FriendlinkListVO> => {
    return request({
      url: '/cms/friendlink',
      method: 'get',
      params,
    });
  },

  /**
   * 查询朋友链接详情
   * @param id 朋友链接ID
   */
  getFriendlinkDetail: (id: string): AxiosPromise<FriendlinkVO> => {
    return request({
      url: `/cms/friendlink/${id}`,
      method: 'get',
    });
  },

  /**
   * 更新朋友链接
   * @param data 更新参数
   */
  updateFriendlink: (data: UpdateFriendlinkDto): AxiosPromise<FriendlinkVO> => {
    return request({
      url: '/cms/friendlink',
      method: 'put',
      data,
    });
  },

  /**
   * 删除朋友链接
   * @param id 朋友链接ID
   */
  deleteFriendlink: (id: string): AxiosPromise<{ success: boolean }> => {
    return request({
      url: `/cms/friendlink/${id}`,
      method: 'delete',
    });
  },
};

export default friendlinkApi;