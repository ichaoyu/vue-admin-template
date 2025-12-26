// API 响应类型
export declare interface IResponse<T = any> {
  status: number;
  data: T extends any ? T : T & any;
  msg: string;
  timestamp: number;
}

// 分页响应类型
export declare interface PageVO<T = any> {
  page: number;
  pageSize: number;
  total: number;
  list: T[];
}

// 分页请求类型
export declare interface PageDTO<T = any> {
  page: number;
  pageSize: number;
  [key: string]: any;
}
