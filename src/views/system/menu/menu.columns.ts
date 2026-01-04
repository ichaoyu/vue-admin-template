const menuTypeMap = {
  0: '目录',
  1: '菜单',
  2: '按钮',
};

const visibleMap = {
  0: '显示',
  1: '隐藏',
};

const statusMap = {
  0: '正常',
  1: '停用',
};

const Columns = [
  {
    key: 'id',
    label: 'ID',
    align: 'center',
  },
  {
    key: 'menuName',
    label: '菜单名称',
  },
  {
    key: 'parentName',
    label: '父菜单',
  },
  {
    key: 'orderNum',
    label: '显示顺序',
    align: 'center',
  },
  {
    key: 'path',
    label: '路由地址',
  },
  {
    key: 'component',
    label: '组件路径',
  },
  {
    key: 'perms',
    label: '权限标识',
  },
  {
    key: 'type',
    label: '菜单类型',
    align: 'center',
    render: (value: string) => menuTypeMap[value],
  },
  {
    key: 'visible',
    label: '显示状态',
    align: 'center',
    render: (value: string) => visibleMap[value],
  },
  {
    key: 'status',
    label: '状态',
    align: 'center',
    render: (value: string) => statusMap[value],
  },
  {
    key: 'icon',
    label: '菜单图标',
  },
  {
    key: 'createBy',
    label: '创建人',
  },
  {
    key: 'updateBy',
    label: '更新人',
  },
];

export default Columns;
