import { RawAxiosRequestHeaders } from 'axios';

// Axios 请求方法类型
export declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put';

// Axios 响应类型
export declare type AxiosResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

// Axios Content-Type 类型
export declare type AxiosContentType =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain';

// Axios 配置类型
export declare interface AxiosConfig {
  params?: any;
  data?: any;
  url?: string;
  method?: AxiosMethod;
  headers?: RawAxiosRequestHeaders;
  responseType?: AxiosResponseType;
}
