/*
 * @Description: This is filter.
 * @Author: dailinbo
 * @Date: 2019-11-13 16:47:20
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-11 19:01:28
 */
import moment from 'moment';
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

const templateTypeFormat = value => {
  const payWayMap = {
    1: 'Management Email',
    2: 'Alert Email',
    3: 'Information Email',
    4: 'Information Message',
    5: 'Alert Message',
  };
  return payWayMap[value] || 'stateless';
};

const chartStatusFormat = value => {
  const payWayMap = {
    0: 'unprocessed',
    1: 'processing',
    2: 'processed',
    9: 'abnormity',
  };
  return payWayMap[value] || 'stateless';
};

const lockedFormat = value => (value === 'L' ? 'Y' : 'N');

const timeFormat = time => {
  const str = formatTimeString(time);
  const strArr = str.split(' ');
  return `${moment(strArr[0]).format('DD-MMM-YYYY')} ${strArr[1]}`;
};

export { userStatus, templateTypeFormat, timeFormat, lockedFormat, chartStatusFormat };
