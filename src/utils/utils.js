// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-underscore-dangle */
/*
 * @Description: lan
 * @Author: lan
 * @Date: 2019-08-28 10:01:59
 * @LastEditTime: 2019-09-24 11:03:39
 * @LastEditors: mus
 */

import { Base64 } from 'js-base64';
import md5 from 'md5';
import { components } from '@/utils/common';

const geneMenuData = data => {
  if (!data || !data.length || !data[0] || !data[0].menuList) return [];
  const id = 'menuid';
  const pid = 'parentmenuid';
  // 删除 所有 routes,以防止多次调用
  const newData = data[0].menuList.map(item => ({
    ...item,
    menuid: item.menuId,
    menuname: item.menuName,
    path: item.page || '',
    icon: item.icon,
    // icon: null,
    name: item.menuName,
    hideInMenu: item.menutype === '1',
    target: item.linecss,
    component: components[item.page],
    // iframeUrl: getIframe(item.page),
  }));

  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  const map = {};
  newData.forEach(item => {
    map[item[id]] = item;
  });
  const val = [];
  newData.forEach(item => {
    // 以当前遍历项，的pid,去map对象中找到索引的id
    const parent = map[item[pid]];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
};

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
const testMode = true;
// 得到随机的NVPS
const getRandowNVPS = () => {
  const array = ['N', 'V', 'P', 'S'];
  const newArray = [];
  while (array.length > 0) {
    const random = Math.floor(Math.random() * array.length);
    newArray.push(array.splice(random, 1)[0]);
  }
  return newArray;
};
const utils = {
  get16(a, v, p) {
    const pp = {};
    const _t = new Date().getTime().toString();
    const _p = JSON.stringify(p);
    pp._0x0111 = Base64.encode(_t);
    pp._0x1011 = Base64.encode(a);
    pp._0x1100 = Base64.encode(v);
    pp._0x1110 = Base64.encode(encodeURIComponent(_p));
    pp._0x1001 = md5(pp._0x0111 + pp._0x1011 + pp._0x1100 + pp._0x1110).toUpperCase();
    pp._0x1101 = Base64.encode(document.location.href);
    return pp;
  }, // get16
  getK(a, v, p) {
    // _params.._version .. _timestamp .. _api_name
    const pp = {};
    const _t = new Date().getTime().toString();
    const _p = JSON.stringify(p);
    pp.KInGDOM = Base64.encode(_t);
    pp.KINGdOM = Base64.encode(a);
    pp.KINGDoM = Base64.encode(v);
    pp.KiNGDOM = Base64.encode(encodeURIComponent(_p));
    pp.kINGDOM = md5(pp.KiNGDOM + pp.KINGDoM + pp.KInGDOM + pp.KINGdOM).toUpperCase();
    pp.KINgDOM = Base64.encode(document.location.href);
    pp.KINGDOm = Base64.encode(document.location.protocol);
    return pp;
  }, // getK
  getL(a, v, p) {
    const pp = {};
    const _t = new Date().getTime().toString();
    const _p = JSON.stringify(p);
    pp.css = Base64.encode(_t);
    pp.android = Base64.encode(a);
    pp.html = Base64.encode(v);
    pp.ios = Base64.encode(encodeURIComponent(_p));
    pp.js = md5(pp.ios + pp.android + pp.css + pp.html).toUpperCase();
    pp.wp = Base64.encode(document.location.href);
    return pp;
  }, // getL
  getParams(a, v, p, lang) {
    const random = Math.random();
    if (testMode) {
      const testParam = {};
      testParam.a = a;
      testParam.v = v;
      testParam.p = JSON.stringify(p);
      testParam.ts = new Date().getTime();
      testParam.bcLangType = lang;
      // testParam.href = document.location.href;
      return testParam;
    }
    if (random === 0) {
      return utils.get16(a, v, p);
    }
    if (random === 1) {
      return utils.getK(a, v, p);
    }
    return utils.getL(a, v, p);
  }, // getParams
};

export default utils;

export { isAntDesignProOrDev, isAntDesignPro, isUrl, geneMenuData, getRandowNVPS };
