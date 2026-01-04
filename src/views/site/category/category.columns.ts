import { dayjs } from 'element-plus';
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
    key: 'name',
    label: '分类名称',
  },
  {
    key: 'parentName',
    label: '父分类',
  },
  {
    key: 'orderNum',
    label: '显示顺序',
    align: 'center',
  },
  {
    key: 'status',
    label: '状态',
    align: 'center',
    render: (value: string) => statusMap[value],
  },
  {
    key: 'createBy',
    label: '创建人',
  },
  {
    key: 'createTime',
    label: '创建时间',
    render: (value: Date) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    key: 'updateBy',
    label: '更新人',
  },
  {
    key: 'updateTime',
    label: '更新时间',
    render: (value: Date) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    key: 'remark',
    label: '备注',
  },
];

export default Columns;
