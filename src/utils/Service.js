/*
 * @Description: request
 * @Author: lan
 * @Date: 2019-08-29 13:21:48
 * @LastEditTime: 2019-09-20 16:12:37
 * @LastEditors: lan
 */
import request from './request';
import utils from './utils';
import Api from '@/services/api';

const { getParams } = utils;
const apisfx = '/api/';

const Service = {
  logout() {
    return request('/logout');
  },
};

Object.keys(Api).forEach(key => {
  Service[key] = (opts = {}) => {
    const a = Api[key];
    const v = opts.version || 'v2.0';
    const p = opts.param || {};
    const lang = opts.lang || 'ZHCN';
    const params = getParams(a, v, p, lang);
    return request(`${apisfx + a}.json`, {
      ...opts,
      method: opts.method || 'POST',
      body: params,
    });
    // return request(`${apisfx}${a}.json`, opt);
  };
});

export default Service;
export { Api };
