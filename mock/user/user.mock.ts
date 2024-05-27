const List: {
  username: string;
  password: string;
  role: string;
  roleId: string;
  permissions: string | string[];
}[] = [
  {
    username: 'admin',
    password: 'admin',
    role: 'admin',
    roleId: '1',
    permissions: ['*.*.*'],
  },
  {
    username: 'test',
    password: 'test',
    role: 'test',
    roleId: '2',
    permissions: ['example:dialog:create', 'example:dialog:delete'],
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
          message: '账号或密码错误',
        };
      }
    },
  },
];
