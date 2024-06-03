import { nextTick, ref } from 'vue';
import type { NProgressOptions } from 'nprogress';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const primaryColor = ref('#747bff');

export const useNProgress = () => {
  NProgress.configure({ showSpinner: false } as NProgressOptions);

  const initColor = async () => {
    await nextTick();
    const bar = document
      .getElementById('nprogress')
      ?.getElementsByClassName('bar')[0] as ElRef;
    if (bar) {
      bar.style.background = primaryColor.value;
    }
  };

  initColor();

  const start = () => {
    NProgress.start();
  };

  const done = () => {
    NProgress.done();
  };

  return {
    start,
    done,
  };
};
