import { dayjs } from 'element-plus';
import { TableColumn } from '@/components/Table/types';

const Columns: TableColumn[] = [
  {
    key: 'tokenId',
    label: '会话编号',
  },
  {
    key: 'userId',
    label: '用户编号',
  },
  {
    key: 'userName',
    label: '用户账号',
  },
  {
    key: 'os',
    label: '操作系统',
  },
  {
    key: 'browser',
    label: '浏览器',
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
