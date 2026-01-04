import { request } from '@/utils';
import { PostListVO, PostVO } from '@/interface/post.interface';

// #region 岗位管理接口
// 获取岗位列表
export const getPostListApi = (): Promise<PostListVO> => {
  return request.get({ url: '/api/system/post' });
};

// 获取岗位详情
export const getPostDetailApi = (id: number | string): Promise<PostVO> => {
  return request.get({ url: `/api/system/post/${id}` });
};

// 创建岗位
export const createPostApi = (data: any): Promise<PostVO> => {
  return request.post({ url: '/api/system/post', data });
};

// 更新岗位
export const updatePostApi = (
  id: number | string,
  data: any,
): Promise<PostVO> => {
  return request.put({ url: `/api/system/post/${id}`, data });
};

// 删除岗位
export const deletePostApi = (id: number | string): Promise<any> => {
  return request.delete({ url: `/api/system/post/${id}` });
};

// 批量删除岗位
export const batchDeletePostApi = (ids: (number | string)[]): Promise<any> => {
  return request.delete({
    url: '/api/system/post',
    params: { ids: ids.join(',') },
  });
};
// #endregion 岗位管理接口
