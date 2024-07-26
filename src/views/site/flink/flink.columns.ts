import { dayjs, ElMessage } from 'element-plus';
import { useClipboard } from '@/hooks/useClipboard';
import { flinkType } from '@/interface';

// 复制
const { copy, copied, isSupported } = useClipboard();
const onCopyItem = (row: string) => {
  if (!isSupported.value) {
    ElMessage.error('你的浏览器不支持 Clipboard API');
    return;
  }
  copy(row);
  copied && ElMessage.success('复制成功');
};

// 查看
const onView = (row: flinkType) => {
  window.open(row.link + '?from=vue', '_blank');
};

const Columns = [
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
    copy: onCopyItem,
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

export default Columns;
