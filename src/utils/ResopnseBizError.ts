import { AxiosRequestConfig } from 'axios';

export default class ResponseBizError extends Error {
  code?: number;
  data?: any;
  isBizError?: boolean;
  config?: AxiosRequestConfig;
}
