import Mock from 'mockjs';

import { UserState } from '@/interface';
interface List extends UserState {
  password?: string;
}
const genertorUserList = (currentPage = 1, pageSize = 10) => {
  const userList: any[] = [];
  for (let i = 0; i < 100; i++) {
    userList.push(
      Mock.mock({
        id: '@id',
        author: '@first',
        title: '@title(2, 4)',
        children: [
          {
            id: '123',
            author: 'cece',
            title: '标题',
          },
          {
            id: '1232',
            author: 'cece2',
            title: '标题1',
          },
        ],
      }),
    );
  }
  const pageList = userList.filter(
    (_, index) =>
      index < pageSize * currentPage && index >= pageSize * (currentPage - 1),
  );
  return pageList;
};
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
  // 用户列表
  {
    url: '/api/mock/user/list',
    method: 'post',
    response: ({ body }) => {
      const { pageSize, currentPage } = body;
      return {
        code: 0,
        data: {
          total: 100,
          list: genertorUserList(currentPage, pageSize),
        },
        msg: '成功',
      };
    },
  },
];
