/*
 * @Des: default request interceptor
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-08 18:06:37
 * @LastEditors: iron
 * @LastEditTime: 2019-11-12 10:31:17
 */

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/camelcase */

import { extend } from 'umi-request';
import uuidv1 from 'uuid/v1';
import { md5 } from 'md5js';
import { notification } from 'antd';
import { getRandowNVPS, isProOrDev } from './utils';

const API_PREFFIX = '/api';
const VERSION = 'v2.0';
const BUSINESS_PREFFIX = 'bayconnect.superlop';
const DEFAULT_PARAM = { bcLangType: 'ZHCN' };

export const codeMessage = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export function setReqHeaders(url, NVPS) {
  let x_trace_user_id = localStorage.getItem('x-trace-user-id');

  if (!x_trace_user_id) {
    x_trace_user_id = uuidv1();
    localStorage.setItem('x-trace-user-id', x_trace_user_id);
  }

  let { x_trace_page_id } = window;

  if (!x_trace_page_id) {
    x_trace_page_id = uuidv1();
    window.x_trace_page_id = x_trace_page_id;
  }

  return {
    'X-Kweb-Menu-Id': document.location.href,
    'X-Kweb-Trace-Req-Id': uuidv1(),
    'X-Kweb-Trace-Page-Id': x_trace_page_id,
    'X-Kweb-Trace-User-Id': x_trace_user_id,
    'X-Kweb-Location-Href': document.location.href,
    'X-Kweb-Timestamp': `${new Date().getTime()}`,
    'X-Kweb-Sign': md5(document.location.href),
    'X-Kweb-Api-Name': url.trim(),
    'X-Kweb-Api-Version': '4.0',
    'X-Bc-S': (() => {
      const randowNVPS = getRandowNVPS();
      const signMode = randowNVPS.join('');
      let signText = '';
      randowNVPS.forEach(value => {
        signText += value + NVPS[value];
      });
      return signMode + md5(signText, 32).toUpperCase();
    })(),
    'X-Bc-T': `BCT${uuidv1().replace(/-/g, '')}`,
  };
}

// unified error handle
export function errorHandler(error) {
  if (!error || typeof error === 'string') {
    notification.warn({
      message: 'oops operate fail',
      description: error || 'error happened',
    });

    // throw error,then model will catch
    return Promise.reject(error);
  }

  if (error instanceof Error) {
    notification.error({
      message: '响应异常',
      description: error.toString(),
    });

    return Promise.reject(error);
  }

  const { response } = error;

  if (response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
  return Promise.reject(response.statusText);
}

export const request = extend({
  // timeout: 10000,
  prefix: `${API_PREFFIX}/${VERSION}/${BUSINESS_PREFFIX}.`,
  suffix: '.json',
  method: 'post',
  requestType: 'form',
  responseType: 'json',
  errorHandler,
});

request.interceptors.request.use((url, opts) => {
  const timestamp = Date.now();
  const strParams = JSON.stringify({ ...DEFAULT_PARAM, ...opts.data });
  const cryptoParams = window.btoa(unescape(encodeURIComponent(strParams)));

  const NVPS = {
    N: url
      .split('/')
      .pop()
      .replace(opts.suffix, ''),
    V: VERSION,
    P: cryptoParams,
    S: timestamp,
  };

  const options = {
    ...opts,
    params: isProOrDev() ? opts.data : {},
    data: {
      bcp: cryptoParams,
      s: timestamp,
    },
    headers: setReqHeaders(url, NVPS),
  };

  return {
    url,
    options,
  };
});

request.interceptors.response.use(async (response, opts) => {
  if (response.status === 200) {
    try {
      const result = await response.clone().json();
      // return complete response
      if (opts.all) {
        return result;
      }
      const { bcjson } = result;
      const { flag, msg } = bcjson;
      if (flag === '1') {
        return bcjson;
      }
      return Promise.reject(msg);
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  }
  return response;
});

export default url => async (params = {}) => request(url, { data: params });
