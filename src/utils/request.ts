import axios from 'axios';
import { notification, message } from 'ant-design-vue';
import { getToken, setToken } from './auth';
import { urlParamsStringify } from './util';
import errorCode from './errorCode';
import ResponseBizError from './ResopnseBizError';
import type { AxiosResponse } from 'axios';

axios.defaults.headers.common['Content-Type'] =
  'application/json;charset=utf-8';

const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  // timeout: 10000,
  // params序列化函数
  paramsSerializer: (params) =>
    urlParamsStringify(params, { addQueryPrefix: false }),
});
// request拦截器
service.interceptors.request.use(
  (orginConfig) => {
    const config = orginConfig;
    // 是否需要设置 token
    const addToken = config.addToken !== false;
    if (getToken() && addToken) {
      // 让每个请求携带自定义token 请根据实际情况自行修改
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['access-token'] = getToken() as string;
    }
    // get 方法添加时间戳
    if (config.addTimestamp !== false) {
      if (['get', 'GET'].includes(config.method as string)) {
        if (config.params) {
          config.params._t = new Date().getTime();
        } else {
          config.params = { _t: new Date().getTime() };
        }
      }
    }
    return config;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    Promise.reject(error);
  },
);

const getNewtoken = (response: AxiosResponse): AxiosResponse => {
  if (response.headers.newToken) {
    setToken(response.headers.newToken);
  }
  return response;
};

const checkDataCode = (response: AxiosResponse) => {
  const { code, data, message } = response.data as any;
  if (code === 0) {
    // responseData.message中
    const error = new ResponseBizError(message || '数据拉取失败, 请刷新重试');
    error.code = code;
    error.data = data;
    error.isBizError = true;
    error.config = response.config;
    throw error;
  } else if (code === 2) {
    // 检验失败，失败信息在responseData.data中
    const error = new ResponseBizError(message || '数据拉取失败, 请刷新重试');
    error.code = code;
    if (Array.isArray(data)) {
      error.data = data.map((x) => `"${x.errorMsg}"`).join(',');
    } else {
      error.data = data;
    }
    error.isBizError = true;
    error.config = response.config;
    throw error;
  }
};

/**
 * 响应拦截器
 *   1.检查网络状态码
 *   2.获取新token
 *   3.获取body体(转实体)
 *   4.检查自定响应码
 * 注意
 *   1.默认 status >= 200 && status < 300 进入 resolve, 否则进入reject。
 *     此验证方法可以通过config.validateStatus改变
 */
service.interceptors.response.use((response) => {
  // 此处的 status 范围是[200, 300]
  // 获取新token
  getNewtoken(response);
  // 检验data响应
  checkDataCode(response);
  return response;
});

const handleAxiosError = (error: any) => {
  const config = error?.config || {};
  const url = `${config.method || ''}:${config.url || ''}`;

  if (error.message === 'Network Error') {
    console.error(url, error);
    notification.error({
      message: '网络异常',
      description: '请检查您的网络设置，成功联网后刷新重试',
    });
  } else if (error.message === 'Request aborted') {
    console.error(url, error);
    notification.error({
      message: '接口调用已取消',
      description: '您已取消接口调用请求，但是服务器可能已经处理您的操作',
    });
  } else if (error.message?.includes('Request failed with status code')) {
    console.error(url, error);
    const statusText = errorCode[error.response?.status as number];
    notification.error({
      message: '调用接口异常',
      description: `${error.response.status}[${statusText}] 请求信息[${url}]`,
      duration: 2,
    });
  }
  return Promise.reject(error);
};

const handleBizError = (error: any) => {
  notification.error({
    message: error.message,
    description: error.data,
    duration: 2,
  });
  return Promise.resolve({
    code: 0,
    message: error.message,
    data: error.data,
  });
};

const showSucessMessage = (response: AxiosResponse) => {
  if (
    ['POST', 'PUT', 'DELETE', 'post', 'put', 'delete'].includes(
      response.config.method as string,
    ) &&
    response.config.showMessage !== false
  ) {
    message.success((response.data as any)?.message || '操作成功');
  }
};

service.interceptors.response.use(
  (response) => {
    showSucessMessage(response);
    return response.data;
  },
  (error) => {
    // 此处error包含以下类型
    // 1. 请求被取消了，message === 'canceled'。此异常与config.cancelToken.throwIfRequested()
    //    配置有关，如果没有配置，则message为此值。
    // 2. status 校验抛出的错误。isAxiosError: true, message: 'Request failed with status code '
    //    + status。通过config.validateStatus改变默认校验规则，但是抛出的错误仍是此类型。
    // 3. 网络错误。isAxiosError: true, message: 'Network Error'。因网络问题而产生的错误。
    // 4. 浏览器中断请求。isAxiosError: true, message: 'Request aborted'。May be opposed to
    //    a manual cancellation。
    // 5. 前面interceptor抛出的异常。

    if (axios.isAxiosError(error)) {
      return handleAxiosError(error);
    } else if (error.isBizError === true) {
      return handleBizError(error);
    } else if (axios.isCancel(error)) {
      // notice: post, put, delete接口不应该手动 cancel
      console.warn(error.config.url, error);
      if (error.config.showCancelMessage === true) {
        notification.warning({
          message: '接口调用已取消',
          description: '接口调用已取消，但是服务器可能已经处理您的操作',
        });
      }
    }
    return Promise.reject(error);
  },
);

service.postNoMessage = function postNoMessage(url, data, config) {
  return service.post(
    url,
    data,
    Object.assign({}, config, { showMessage: false }),
  );
};
service.putNoMessage = function putNoMessage(url, data, config) {
  return service.put(
    url,
    data,
    Object.assign({}, config, { showMessage: false }),
  );
};
service.deleteNoMessage = function deleteNoMessage(url, config) {
  return service.delete(url, Object.assign({}, config, { showMessage: false }));
};

export default service;
