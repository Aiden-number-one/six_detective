/*
 * @Description: request
 * @Author: lan
 * @Date: 2019-08-29 13:21:48
 * @LastEditTime: 2019-08-30 14:05:44
 * @LastEditors: lan
 */
import request from './request';
import utils from './utils';

const { getParams } = utils;
const apisfx = '/api/';
const Api = {
  // getPortal: 'kingdom.retl.get_dataportal_theme_info', // 获取数据门户主题列表
  getDatas: 'getDatas',
  delDatas: 'delDatas',
  getDataSourceList: 'getDataSourceList',
};

const Service = {
  logout() {
    return request('/logout');
  },
};

Object.keys(Api).forEach(key => {
  Service[key] = (opts = {}) => {
    // let opt = { ...opts };
    const a = Api[key];
    // const v = opts.version || '1.0.0';
    // const p = opts.param || {};
    // const lang = opts.lang || 'zh-cn';
    // const params = getParams(a, v, p, lang);
    // opt = {
    //   method: opts.method || 'POST',
    //   body: params,
    // };
    return request(apisfx + a);
    // return request(`${apisfx}${a}.json`, opt);
  };
});

export default Service;
export { Api };
