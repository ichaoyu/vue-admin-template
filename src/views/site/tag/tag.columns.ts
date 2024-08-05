import { dayjs } from 'element-plus';
import { TableColumn } from '@/components/Table/types';

const Columns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: 50,
  },
  {
    key: 'name',
    label: '名称',
  },
  {
    key: 'path',
    label: '路径',
  },
  {
    key: 'updateTime',
    label: '更新时间',
    render: (value: Date | null) =>
      value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
  },
];

export default Columns;
