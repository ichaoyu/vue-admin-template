import { request } from '@/utils';
import { UserLoginType } from '@/interface/user.interface';

export const loginApi = (data: UserLoginType) => {
  return request.post({ url: '/api/user/login', data });
};
