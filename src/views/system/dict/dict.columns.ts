import { dayjs } from 'element-plus';
import { TableColumn } from '@/components/Table/types';
import { DictTypeType } from '@/interface';
import router from '@/router';

const onView = (row: DictTypeType) => {
  router.push({ path: `/system/dictData/${row.id}` });
};

export const TypeColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: 50,
  },
  {
    key: 'dictName',
    label: '字典名称',
    alotName: 'dictName',
    oprAction: onView,
  },
  {
    key: 'dictType',
    label: '字典类型',
  },
  {
    key: 'status',
    label: '状态',
    slotName: 'status',
  },
  {
    key: 'remark',
    label: '备注',
  },
  {
    key: 'updateTime',
    label: '更新时间',
    render: (value: Date | null) =>
      value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
  },
];

export const DataColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'dictLabel',
    label: '字典标签',
  },
  {
    key: 'dictValue',
    label: '字典键值',
  },
  {
    key: 'dictType',
    label: '字典类型',
  },
  {
    key: 'isDefault',
    label: '是否默认',
    dictMap: {
      value: {
        Y: '是',
        N: '否',
      },
    },
  },
  {
    key: 'status',
    label: '状态',
    dictMap: {
      value: {
        0: '正常',
        1: '停用',
      },
      color: {
        0: 'var(--el-color-primary)',
        1: 'var(--el-color-danger)',
      },
    },
  },
  {
    key: 'remark',
    label: '备注',
  },
  {
    key: 'updateTime',
    label: '更新时间',
    render: (value: Date | null) =>
      value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
  },
];
