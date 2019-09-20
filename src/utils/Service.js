/*
 * @Description: request
 * @Author: lan
 * @Date: 2019-08-29 13:21:48
 * @LastEditTime: 2019-09-19 17:53:10
 * @LastEditors: mus
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
    const v = opts.version || '1.0.0';
    const p = opts.param || {};
    const lang = opts.lang || 'zh-cn';
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
