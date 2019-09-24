/*
 * @Description: request
 * @Author: lan
 * @Date: 2019-08-29 13:21:48
 * @LastEditTime: 2019-09-24 13:48:30
 * @LastEditors: mus
 */
import { Base64 } from 'js-base64';
import request from './request';
import Api from '@/services/api';

const apisfx = '/api/';
const bcLangType = 'ZHCN';

const Service = {
  logout() {
    return request('/logout');
  },
};

Object.keys(Api).forEach(key => {
  Service[key] = (opts = {}) => {
    const N = Api[key]; // 接口名
    const V = opts.version || 'v2.0'; // 版本号
    const P = opts.param || {}; // 参数
    const S = new Date().getTime();
    P.bcLangType = bcLangType;
    const base64Param = Base64.encode(JSON.stringify(P));
    return request(
      `${`${apisfx + V}/${N}`}.json`,
      {
        ...opts,
        method: opts.method || 'POST',
        body: {
          bcp: base64Param,
          s: S,
        },
      },
      {
        N,
        V,
        P: base64Param,
        S,
      },
    );
  };
});

export default Service;
export { Api };
