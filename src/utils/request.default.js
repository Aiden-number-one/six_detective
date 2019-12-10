/*
 * @Des: default request interceptor
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-08 18:06:37
 * @LastEditors: iron
 * @LastEditTime: 2019-12-10 21:10:55
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

  if (response && response.status) {
    const { status, statusText, url } = response;
    const errorText = statusText;
    notification.error({
      message: errorText,
      description: `request error ${status}: ${/[^/]*\.json/.exec(url)}`,
    });
  }
  return response;
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

  const options = {
    ...opts,
    params: isProOrDev() ? opts.data : {},
    data: {
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
  const { flag, items, msg, ...others } = bcjson;

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

  return +flag === 1 ? { items, ...others } : { err: msg || 'response data error' };
});

export default url => async (params = {}) => request(url, { data: params });
