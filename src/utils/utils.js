// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-underscore-dangle */
/*
 * @Description: lan
 * @Author: lan
 * @Date: 2019-08-28 10:01:59
 * @LastEditTime: 2019-09-25 15:38:02
 * @LastEditors: lan
 */

import { components } from '@/utils/common';

const geneMenuData = data => {
  if (!data || !data.length || !data[0] || !data[0].menuList) return [];
  const id = 'menuId';
  const pid = 'parentMenuId';
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

const isProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return false;
};
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

export { isProOrDev, isUrl, geneMenuData, getRandowNVPS };
