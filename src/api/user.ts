import { request } from '@/utils';
interface UserType {
  username: string;
  password: string;
}
export const loginApi = (data: UserType) => {
  return request.post({ url: '/api/user/login', data });
};
