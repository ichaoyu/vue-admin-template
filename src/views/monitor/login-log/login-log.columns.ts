import { dayjs } from 'element-plus';
import { TableColumn } from '@/components/Table/types';

const Columns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: 50,
  },
  {
    key: 'userName',
    label: '用户账号',
  },
  {
    key: 'browser',
    label: '浏览器',
  },
  {
    key: 'os',
    label: '操作系统',
  },
  {
    key: 'status',
    label: '登录状态',
    dictMap: {
      value: {
        0: '成功',
        1: '失败',
      },
      color: {
        0: 'var(--el-color-primary)',
        1: 'var(--el-color-danger)',
      },
    },
  },
  {
    key: 'msg',
    label: '提示消息',
  },
  {
    key: 'loginIp',
    label: '登录 IP',
  },
  {
    key: 'loginLocation',
    label: '登录地点',
  },
  {
    key: 'loginDate',
    label: '登录时间',
    render: (value: Date | null) =>
      value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
  },
];

export default Columns;
