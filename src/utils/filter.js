/*
 * @Description: This is filter.
 * @Author: dailinbo
 * @Date: 2019-11-13 16:47:20
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-04 15:14:35
 */
// import moment from 'moment';

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
  const str1 = time.substring(0, 8);
  const str2 = time.substring(9);
  const newstr1 = `${str1.substring(0, 4)}/${str1.substring(5, 6)}/${str1.substring(7)}`;
  const newstr2 = `${str2.substring(0, 1)}:${str1.substring(2, 3)}:${str1.substring(4)}`;
  return newstr1 + newstr2;
};
// const timeFormat = time => time;

export { userStatus, timeFormat };
