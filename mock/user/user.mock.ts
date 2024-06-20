import { UserState } from '@/interface';
interface List extends UserState {
  password?: string;
}
const List: List[] = [
  {
    username: 'admin',
    roleIDs: ['admin'],
    permission: ['*.*.*'],
    token: 'x0Pliqum',
    password: '123456',
  },
  {
    username: 'test',
    roleIDs: ['test'],
    permission: ['example:dialog:create', 'example:dialog:delete'],
    token: 'x0Pliqum',
    password: '123456',
  },
];
export default [
  {
    url: '/api/mock/user/login',
    method: 'post',
    response: ({ body }) => {
      const data = body;
      let hasUser = false;
      for (const user of List) {
        if (
          user.username === data.username &&
          user.password === data.password
        ) {
          hasUser = true;
          return {
            code: 0,
            data: user,
            msg: '操作成功',
          };
        }
      }
      if (!hasUser) {
        return {
          code: 500,
          msg: '账号或密码错误',
        };
      }
    },
  },
  // 退出接口
  {
    url: '/api/mock/user/loginOut',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: null,
      };
    },
  },
];
