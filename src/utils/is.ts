export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`;
};
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};
