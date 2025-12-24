// 通用函数类型
export declare interface Fn<T = any> {
  (...arg: T[]): T;
}

// 可空类型
export declare type Nullable<T> = T | null;

// Element引用类型
export declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

// 记录类型
export declare type Recordable<T = any, K = string> = Record<
  K extends null | undefined ? string : K,
  T
>;

// 组件引用类型
export declare type ComponentRef<T> = InstanceType<T>;
