/*
 * @Description: request
 * @Author: lan
 * @Date: 2019-08-29 13:21:48
 * @LastEditTime: 2019-11-08 15:07
 * @LastEditors: iron
 */

import { request } from './request.default';
import Api from '@/services/api';

const Service = {
  logout() {
    return request('/logout');
  },
};

Object.keys(Api).forEach(key => {
  Service[key] = (opts = {}) =>
    request(Api[key], {
      all: true,
      data: {
        ...opts.param,
      },
    });
});

export default Service;
export { Api };
