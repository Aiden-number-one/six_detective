/*
 * @Des: default request interceptor
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-08 18:06:37
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-19 15:36:24
 */

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/camelcase */

import { extend } from 'umi-request';
import uuidv1 from 'uuid/v1';
import { md5 } from 'md5js';
import { stringify } from 'querystring';
import { message } from 'antd';
import router from 'umi/router';
import { getRandowNVPS, isFormData } from './utils';
import Service from '@/services/common';

const { getLoginStatus } = Service;

const API_PREFFIX = '/api';
const VERSION = 'v2.0';
const BUSINESS_PREFFIX = 'bayconnect.superlop';
const DEFAULT_PARAM = { bcLangType: 'ENUS' };

export function setReqHeaders(NVPS) {
  const rid = `RID${uuidv1().replace(/-/g, '')}`;
  return {
    'X-Bc-S': (() => {
      const randowNVPS = getRandowNVPS();
      const signMode = randowNVPS.join('');
      let signText = '';
      randowNVPS.forEach(value => {
        signText += value + NVPS[value];
      });
      signText += `I${rid}`;
      return signMode + md5(signText, 32).toUpperCase();
    })(),
    'X-Bc-T': `BCT${localStorage.getItem('BCTID')}`,
    'X-Bc-I': rid, // ensure unique request
  };
}

// unified error handle
export function errorHandler(error) {
  console.log('requst error:', error);

  const { response } = error;

  const queryString = stringify({
    redirect: window.location.href,
  });
  if (response.url.includes(`${getLoginStatus}`)) {
    router.push(`/login?${queryString}`);
  }

  if (response && response.status) {
    const { statusText } = response;
    const errorText = statusText;
    message.error(errorText);
  }
  return Promise.reject();
}

export const request = extend({
  // timeout: 3000,
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
  // 将来去掉，目前只为方便现在调试方便
  const longJson =
    url === '/api/v2.0/bayconnect.superlop.set_report_template_content_edit.json' ||
    url === '/api/v2.0/bayconnect.superlop.set_report_template_data_query.json';
  const options = {
    ...opts,
    // params: isProOrDev() && !longJson ? {...opts.params,...opts.data} :{}, // 暂时为测试放开
    params: !longJson ? { ...opts.params, ...opts.data } : {}, // 暂时为测试放开
    data: isFormData(opts.data)
      ? opts.data
      : {
          bcp: cryptoParams,
          s: timestamp,
        },
    headers: setReqHeaders(NVPS),
  };

  return {
    url,
    options,
  };
});

request.interceptors.response.use(async (response, opts) => {
  if (response.status !== 200) {
    return response;
  }

  const result = await response.clone().json();

  const { bcjson } = result || {};
  const { flag, items, msg, ...others } = bcjson || {};

  // login invalid
  if (flag === '001') {
    if (msg.indexOf('set_sys_logout') < 0) {
      // eslint-disable-next-line no-underscore-dangle
      window.g_app._store.dispatch({ type: 'login/logout' });
    }
  }
  // return complete response
  if (opts.all) {
    return result;
  }

  return +flag === 1 ? { items, msg, ...others } : { err: msg || 'response data error' };
});

export default url => async (params = {}) => request(url, { data: params });
