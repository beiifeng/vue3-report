import { ResponseBodyType } from '@/utils/requestTool';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 是否添加access-token请求头, 默认true */
    addToken?: boolean;
    /** get请求是否添加时间戳(_t), 默认true */
    addTimestamp?: boolean;
    /** 请求是否显示提示框, 默认true */
    showMessage?: boolean;
    /** 当手动取消接口调用时, 是否显示提示, 默认false */
    showCancelMessage?: boolean;
  }

  export interface AxiosInstance {
    request<D = any>(config: AxiosRequestConfig<D>): Promise<any>;
    get<D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<any>;
    delete<D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<any>;
    head<D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<any>;
    options<D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<any>;
    post<D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<any>;
    put<D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<any>;
    patch<D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<any>;

    deleteNoMessage(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<ResponseBodyType>;
    postNoMessage(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<ResponseBodyType>;
    putNoMessage(
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<ResponseBodyType>;
  }
}

export type WithFalse<T> = T | false;

export type WithNull<T> = T | null;
