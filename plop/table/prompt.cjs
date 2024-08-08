// const toUpperCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
import { firstUpperCase, line2UpperCase } from '@/utils';
module.exports = {
  description: 'Create nest Module',
  prompts: [
    {
      type: 'input',
      name: 'path',
      message: '请输入路径（如：site）',
      default: 'site',
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入模块名称（如：flink）',
    },
    {
      type: 'input',
      name: 'title',
      message: '请输入模块汉字名称（如：友情链接）',
    },
  ],
  actions: (data) => {
    const { name, path, title } = data;
    const FirstUpperCase = firstUpperCase(name);
    const UpperCaseName = line2UpperCase(name, '-');

    const actions = [];
    if (name && path && title) {
      actions.push(
        {
          type: 'add',
          path: `./src/views/${path}/${name}/index.ts`,
          templateFile: './plop/table/index.hbs',
          data: {
            name,
            FirstUpperCase,
            UpperCaseName,
          },
        },
        // 主文件vue
        {
          type: 'add',
          path: `./src/views/${path}/${name}/${name}.vue`,
          templateFile: './plop/table/main.hbs',
          data: {
            path,
            name,
            title,
            FirstUpperCase,
            UpperCaseName,
          },
        },
        // 列
        {
          type: 'add',
          path: `./src/views/${path}/${name}/${name}.columns.ts`,
          templateFile: './plop/table/columns.hbs',
          data: {
            path,
            name,
            title,
            FirstUpperCase,
            UpperCaseName,
          },
        },
        // create
        {
          type: 'add',
          path: `./src/views/${path}/${name}/${name}.create.vue`,
          templateFile: './plop/table/create.hbs',
          data: {
            path,
            name,
            title,
            FirstUpperCase,
            UpperCaseName,
          },
        },
      );
    }

    return actions;
  },
};
