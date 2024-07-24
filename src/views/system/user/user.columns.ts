import { dayjs } from 'element-plus';
const sexMap = {
  0: '男',
  1: '女',
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
    key: 'nickName',
    label: '昵称',
  },
  {
    key: 'userName',
    label: '用户名',
  },
  {
    key: 'phone',
    label: '手机',
  },
  {
    key: 'email',
    label: '邮箱',
  },
  {
    key: 'sex',
    label: '性别',
    render: (value: string) => sexMap[value],
  },
  {
    key: 'status',
    label: '状态',
    render: (value: string) => statusMap[value],
  },
  {
    key: 'loginIp',
    label: '登录IP',
  },
  {
    key: 'loginDate',
    label: '登录时间',
    render: (value: Date) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    key: 'remark',
    label: '备注',
  },
];
export default Columns;
