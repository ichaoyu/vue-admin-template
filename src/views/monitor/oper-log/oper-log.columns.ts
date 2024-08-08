import { dayjs } from 'element-plus';
import { TableColumn } from '@/components/Table/types';
const Columns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: 50,
  },
  {
    key: 'title',
    label: '操作模块',
  },
  {
    key: 'bizType',
    label: '业务类型',
    dictMap: {
      value: {
        '0': '其他',
        '1': '新增',
        '2': '修改',
        '3': '删除',
        '4': '授权',
        '5': '导出',
        '6': '导入',
        '7': '强退',
        '8': '清空数据',
      },
    },
  },
  {
    key: 'method',
    label: '请求类型',
  },
  {
    key: 'requestMethod',
    label: '请求方式',
  },
  {
    key: 'requestUrl',
    label: '请求地址',
  },
  {
    key: 'requestParams',
    label: '请求参数',
    copy: true,
  },
  {
    key: 'requestResult',
    label: '请求结果',
  },
  {
    key: 'operName',
    label: '操作人员',
  },
  {
    key: 'operIp',
    label: '操作地址',
  },
  {
    key: 'operLocation',
    label: '操作地点',
  },
  {
    key: 'status',
    label: '状态',
    sortable: true,
    dictMap: {
      value: {
        0: '正常',
        1: '异常',
      },
      color: {
        0: 'var(--el-color-primary)',
        1: 'var(--el-color-danger)',
      },
    },
  },
  {
    key: 'errorMsg',
    label: '错误消息',
  },
  {
    key: 'operTime',
    label: '操作时间',
    sortable: true,
    minWidth: 90,
    render: (value: Date | null) =>
      value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    key: 'costTime',
    label: '消耗时间',
    sortable: true,
    minWidth: 90,
    render: (value: Date | null) => (value ? value + 'ms' : ''),
  },
];

export default Columns;
