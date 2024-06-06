export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`;
};
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};

export const isUrl = (path: string): boolean => {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-:&=\\+\\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\\+\\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\\+~%\\/.\w-_]*)?\??(?:[-\\+=&%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
};
