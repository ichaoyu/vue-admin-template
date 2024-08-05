import { dayjs } from 'element-plus';
import { tagType } from '@/interface';
import { TableColumn } from '@/components/Table/types';

// 查看
const onView = (row: tagType, index: number, data: tagType[]) => {
  console.log(row, index, data);
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
