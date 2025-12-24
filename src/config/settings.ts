import { Settings } from '@/interface';
import {
  STORAGE_PREFIX,
  DEFAULT_TITLE,
  DEFAULT_LOGO,
  DEFAULT_SHOW_LOGO,
} from '@/constants';

const settings: Settings = {
  storagePrefix: STORAGE_PREFIX,
  title: DEFAULT_TITLE,
  logo: DEFAULT_LOGO,
  isShowLogo: DEFAULT_SHOW_LOGO,
};

export default settings;
