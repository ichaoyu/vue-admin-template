import { RawAxiosRequestHeaders } from 'axios';
declare global {
  declare type Recordable<T = any, K = string> = Record<
    K extends null | undefined ? string : K,
    T
  >;

  declare type AxiosMethod = 'get' | 'post' | 'delete' | 'put';
  declare type AxiosResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';
  declare type AxiosContentType =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';
  declare interface AxiosConfig {
    params?: any;
    data?: any;
    url?: string;
    method?: AxiosMethod;
    headers?: RawAxiosRequestHeaders;
    responseType?: AxiosResponseType;
  }

  declare interface IResponse<T = any> {
    code: number;
    data: T extends any ? T : T & any;
    msg: string;
  }
}
