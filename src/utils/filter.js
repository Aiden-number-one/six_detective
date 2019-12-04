/*
 * @Description: This is filter.
 * @Author: dailinbo
 * @Date: 2019-11-13 16:47:20
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-04 19:34:03
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

const timeFormat = time => formatTimeString(time);
// const timeFormat = time => time;

export { userStatus, timeFormat };
