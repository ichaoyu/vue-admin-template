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
 * @example setCssVar('--el-color-primary', '#000')
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
 * @example getCssVar('--el-color-primary') --> #000
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
