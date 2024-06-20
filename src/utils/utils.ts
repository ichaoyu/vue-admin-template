/**
 * 把对象转为formData
 */
export const objToFormData = (obj: Recordable) => {
  const formData = new FormData();
  Object.keys(obj).forEach((key) => {
    formData.append(key, obj[key]);
  });
  return formData;
};

/**
 * 设置css变量
 * @param prop css变量名
 * @param val 变量值
 * @param dom 插入元素 默认root下
 */
export const setCssVar = (
  prop: string,
  val: any,
  dom = document.documentElement,
) => {
  dom.style.setProperty(prop, val);
};

/**
 * 获取dom的css变量值
 * @param prop css变量名
 * @param dom dom元素
 * @returns 返回的颜色值
 */
export const getCssVar = (prop: string, dom = document.documentElement) => {
  return dom.style.getPropertyValue(prop);
};

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
};

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn);
  }
  let index = -1;
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary);
    if (ret) {
      index = i;
      return ret;
    }
  });
  return index;
};
