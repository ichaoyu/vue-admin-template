// 获取传入的值的类型
const getValueType = (value: any) => {
  const type = Object.prototype.toString.call(value);
  return type.slice(8, -1);
};
// 存储变量添加统一前缀
const pre: string = 'VAT_';

export const useStorage = (
  type: 'sessionStorage' | 'localStorage' = 'sessionStorage',
) => {
  // 设置
  const setStorage = (key: string, value: any) => {
    if (!key || !value) return null;
    key = pre + key;
    const valueType = getValueType(value);
    window[type].setItem(key, JSON.stringify({ type: valueType, value }));
  };
  // 获取
  const getStorage = (key: string) => {
    if (!key) return null;
    key = pre + key;
    const value = window[type].getItem(key);
    if (value) {
      const { value: val } = JSON.parse(value);
      return val;
    } else {
      return value;
    }
  };
  // 删除单个
  const removeStorage = (key: string) => {
    key = pre + key;
    window[type].removeItem(key);
  };
  // 批量删除
  const clear = (excludes?: string[]) => {
    // 获取排除项
    const keys = Object.keys(window[type]);
    const defaultExcludes = ['dynamicRouter', 'serverDynamicRouter'];
    const excludesArr = excludes
      ? [...excludes, ...defaultExcludes]
      : defaultExcludes;
    const excludesKeys = excludesArr
      ? keys.filter((key) => !excludesArr.includes(key))
      : keys;
    // 排除项不清除
    excludesKeys.forEach((key) => {
      window[type].removeItem(key);
    });
  };
  return {
    setStorage,
    getStorage,
    removeStorage,
    clear,
  };
};
