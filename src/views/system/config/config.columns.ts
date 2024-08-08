import { dayjs, ElMessage } from 'element-plus';
import { useClipboard } from '@/hooks/useClipboard';

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

const Columns = [
  {
    key: 'id',
    label: 'ID',
    width: 50,
  },
  {
    key: 'configName',
    label: '参数名称',
    oprAction: 'onView',
  },
  {
    key: 'configKey',
    label: '参数键名',
    copy: onCopyItem,
  },
  {
    key: 'configValue',
    label: '参数键值',
  },
  {
    key: 'configType',
    label: '系统内置',
    dictMap: {
      value: {
        Y: '是',
        N: '否',
      },
    },
  },
  {
    key: 'createTime',
    label: '创建时间',
    render: (value: Date) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    key: 'remark',
    label: '备注',
  },
];

export default Columns;
