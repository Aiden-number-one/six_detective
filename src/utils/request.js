// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-underscore-dangle */
/*
 * @Description: request
 * @Author: lan
 * @Date: 2019-08-28 10:01:59
 * @LastEditTime: 2019-09-24 13:42:24
 * @LastEditors: mus
 */
import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import router from 'umi/router';
import queryString from 'query-string';
import uuidv1 from 'uuid/v1';
import { md5 } from 'md5js';
import { getRandowNVPS } from './utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
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

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

// export default async function request(url, options) {
//   const response = await fetch(url, options);

//   checkStatus(response);

//   const data = await response.json();

//   return data;
// }

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option, NVPS) {
  const options = {
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const defaultOptions = {
    credentials: 'include',
  };
  // eslint-disable-next-line @typescript-eslint/camelcase
  let x_trace_user_id = localStorage.getItem('x-trace-user-id');
  // eslint-disable-next-line @typescript-eslint/camelcase
  if (!x_trace_user_id) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    x_trace_user_id = uuidv1();
    localStorage.setItem('x-trace-user-id', x_trace_user_id);
  }
  // eslint-disable-next-line @typescript-eslint/camelcase
  let { x_trace_page_id } = window;
  // eslint-disable-next-line @typescript-eslint/camelcase
  if (!x_trace_page_id) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    x_trace_page_id = uuidv1();
    // eslint-disable-next-line @typescript-eslint/camelcase
    window.x_trace_page_id = x_trace_page_id;
  }
  const headers = {
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
  const newOptions = {
    ...defaultOptions,
    ...options,
    headers,
  };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = queryString.stringify(newOptions.body);
      // newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  } else if (newOptions.method === 'GET') {
    newOptions.headers = {
      Accept: 'application/json',
      ...newOptions.headers,
    };
    const paramsMap = newOptions.body;
    if (paramsMap) {
      // 拼接参数
      const paramsArray = Object.keys(paramsMap).map(key => `${key}=${paramsMap[key]}`);
      if (url.search(/\?/) === -1) {
        // eslint-disable-next-line no-param-reassign
        url += `?${paramsArray.join('&')}`;
      } else {
        // eslint-disable-next-line no-param-reassign
        url += `&${paramsArray.join('&')}`;
      }
    }
    delete newOptions.body;
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      response
        .clone()
        .text()
        .then(res => {
          try {
            const val = JSON.parse(res);
            if (val.kdjson.flag === '001') {
              window.g_app._store.dispatch({ type: 'global/setLogout' });
              router.push('/login');
            }
            if (val.kdjson.flag === '0000') {
              notification.error({
                message: '请求错误',
                description: val.kdjson.msg,
              });
            }
            if (val.kdjson.flag === '0') {
              message.error(val.kdjson.msg);
            }
          } catch (error) {
            // console.log(error);
          }
        });
      return response;
    })
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      let responseJson = { flag: 'F', msg: '连接超时，请稍后重试' };
      try {
        responseJson = response.json();
      } catch (error) {
        console.log(error);
      }

      return responseJson;
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        window.g_app._store.dispatch({
          type: 'global/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        // router.push('/exception/403');
        return;
      }
      if (status <= 504 && status >= 500) {
        // router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        // router.push('/exception/404');
      }
    });
}
