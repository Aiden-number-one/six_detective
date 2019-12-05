/*
 * @Description: This is filter.
 * @Author: dailinbo
 * @Date: 2019-11-13 16:47:20
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-05 08:55:03
 */
// import moment from 'moment';
import { formatTimeString } from '@/utils/utils';

const userStatus = value => {
  const payWayMap = {
    0: '正常',
    1: '锁定',
    2: '解锁',
    3: '销户',
    4: '销户恢复',
    5: '密码修改',
    6: '密码重置',
  };
  return payWayMap[value] || '未知状态';
};

const timeFormat = time => {
  const str = formatTimeString(time);
  const strArr = str.split(' ');
  const str1 = strArr[0];
  const str2 = strArr[1];
  const strA1 = str1.split('/');
  const temp = strA1[0];
  // eslint-disable-next-line prefer-destructuring
  strA1[0] = strA1[2];
  strA1[2] = temp;
  const s1 = strA1.join('/');
  const obj = {
    t1: s1,
    t2: str2,
  };
  return obj;
};
// const timeFormat = time => time;

export { userStatus, timeFormat };
