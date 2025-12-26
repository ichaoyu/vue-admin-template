import axios from 'axios';
import { ElMessage, ElNotification } from 'element-plus';
import qs from 'qs';
import { objToFormData } from '@/utils';
import {
  AxiosInstance,
  InternalAxiosRequestConfig,
  RequestConfig,
  AxiosResponse,
} from './types';
import { useUserStoreOut } from '@/store/modules/user';

const isMock = import.meta.env.VITE_USE_MOCK === 'true';
// const PATH_URL = import.meta.env.VITE_APP_BASE_API;
/**
 * 创建axios实例
 */
const axiosInstance: AxiosInstance = axios.create({
  timeout: 5000,
  // baseURL: PATH_URL,
});

/**
 * 请求拦截器
 */
const defaultRequestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
  ) {
    // 路由参数
    config.data = qs.stringify(config.data);
  } else if (
    config.method === 'post' &&
    config.headers['Content-Type'] === 'multipart/form-data'
  ) {
    // form-data
    config.data = objToFormData(config.data);
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string;
    url += '?';
    const keys = Object.keys(config.params);
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`;
      }
    }
    url = url.substring(0, url.length - 1);
    config.params = {};
    config.url = url;
  }
  return config;
};
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  //config配置对象,headers属性请求头,经常给服务器端携带公共参数
  const url = config.url || '';
  if (isMock) {
    // 使用mock时更换url 用于区分
    config.url = url.replace('/api', '/mock');
  }
  console.log('config: ', config);
  return config;
});

axiosInstance.interceptors.request.use(defaultRequestInterceptors);

/**
 * 响应拦截器
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    console.log('response: ', response);
    // #region 成功回调
    if (response?.config?.responseType === 'blob') {
      // 文件流直接返回全部
      return response;
    }
    
    const { code, message, data } = response.data;
    
    // 成功时返回data数据
    if (code === 200) {
      return data;
    } else {
      // 失败时显示错误信息
      ElMessage.error(message ?? '未知错误');
      return Promise.reject(new Error(message ?? '请求失败'));
    }
  },
  (error) => {
    const errorData = error?.response?.data;
    const errorMsg =
      errorData?.message ??
      errorData?.msg ??
      error?.message ??
      error?.statusText ??
      '请求失败';

    // 无权限 阻断操作 跳转到登录页
    if (error?.response?.status === 401 || errorData?.code === 401) {
      ElNotification.error('登录已过期，请重新登录！');
      sessionStorage.clear();
      return false;
    } else {
      //提示错误信息
      ElMessage.error(errorMsg);
    }
    return Promise.reject(error);
  },
);

// #region 封装axios
const service = (config: RequestConfig) => {
  return new Promise((resolve, reject) => {
    if (config.interceptors?.requestInterceptors) {
      config = config.interceptors.requestInterceptors(config as any);
    }

    axiosInstance
      .request(config)
      .then((res) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
// #endregion 封装axios

const request = (option: AxiosConfig) => {
  const userStore = useUserStoreOut();
  const { url, method, params, data, headers, responseType } = option;
  return service({
    url,
    method,
    params,
    data,
    responseType,
    headers: {
      'Content-Type': 'application/json',
      [userStore.getTokenKey ?? 'Authorization']:
        `Bearer ${userStore.getToken}`,
      ...headers,
    },
  });
};
// #region 对外暴露
export default {
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<T>;
  },
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<T>;
  },
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<T>;
  },
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<T>;
  },
};
