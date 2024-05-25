import request from '@/utils/request';

export const loginApi = (data) => {
  return request({ url: '/api/user/login', method: 'post', data });
};
