import { dayjs } from 'element-plus';
import { flinkType } from '@/interface';
import { TableColumn } from '@/components/Table/types';

// 查看
const onView = (row: flinkType) => {
  window.open(row.link + '?from=vue', '_blank');
};

const Columns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: 50,
  },
  {
    key: 'title',
    label: '名称',
    oprAction: onView,
  },
  {
    key: 'link',
    label: '链接',
    copy: true,
  },
  {
    key: 'remark',
    label: '备注',
    slotName: 'remark',
  },
  {
    key: 'updateTime',
    label: '更新时间',
    render: (value: Date | null) =>
      value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
  },
];

export default Columns;
