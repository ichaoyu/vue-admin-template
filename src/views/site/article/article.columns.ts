import { dayjs } from 'element-plus';
import { ArticleType } from '@/interface';
import { TableColumn } from '@/components/Table/types';

// 查看
const onView = (row: ArticleType, index: number, data: ArticleType[]) => {
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
    label: '标题',
    oprAction: onView,
  },
  {
    key: 'attr',
    label: '分类',
    dictMap: {
      value: {
        1: '头条',
        2: '推荐',
        3: '轮播',
        4: '热门',
      },
    },
  },
  {
    key: 'author',
    label: '作者',
  },
  {
    key: 'status',
    label: '状态',
    dictMap: {
      value: {
        0: '已发布',
        1: '未发布',
      },
      color: {
        0: 'var(--el-color-primary)',
        1: 'var(--el-color-danger)',
      },
    },
  },
  {
    key: 'pv',
    label: '浏览量',
  },
  {
    key: 'updateTime',
    label: '更新时间',
    render: (value: Date | null) =>
      value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '',
  },
];

export default Columns;
