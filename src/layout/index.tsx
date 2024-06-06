import { defineComponent, computed, unref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useRenderLayout } from './components/useRenderLayout';

const appStore = useAppStore();

const layout = computed(() => appStore.getLayout);

const renderLayout = () => {
  switch (unref(layout)) {
    case 'classic':
      const { renderClassic } = useRenderLayout();
      return renderClassic();
    default:
      break;
  }
};

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => <>{renderLayout()}</>;
  },
});
