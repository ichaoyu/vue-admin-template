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
    label: '姓名',
  },
  {
    key: 'tel',
    label: '电话',
  },
  {
    key: 'company',
    label: '公司名称',
  },
  {
    key: 'content',
    label: '留言内容',
  },
  {
    key: 'createTime',
    label: '创建时间',
    render: (value: Date | null) =>
      value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
  },
];

export default Columns;
