/*
 * @Description: This is filter.
 * @Author: dailinbo
 * @Date: 2019-11-13 16:47:20
 * @LastEditors  : lan
 * @LastEditTime : 2020-01-15 13:48:11
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

const dataChartFormat = value => {
  const setMap = {
    name: 'HKEF',
    ecpRecords: 'Records Received from ECP',
    importRecords: 'Records Imported by user',
    eliminatedRecords: 'TO Records Eliminated',
    eliminatedTotal: 'Duplicated Records Eliminated',
    lateRecords: 'Late Submission',
    adjustmentRecords: 'Adjustment for Format Conversion',
    // 'Records Received from ECP': 'ecpRecords',
    // 'Records Imported by user': 'importRecords',
    // 'TO Records Eliminated': 'eliminatedRecords',
    // 'Duplicated Records Eliminated': 'eliminatedTotal',
    // 'Late Submission': 'lateRecords',
    // 'Adjustment of Stock Options Records for Format Conversion': 'adjustmentRecords',
  };
  return setMap[value];
};

const lockedFormat = value => (value === 'Y' ? 'Y' : 'N');

const timeFormat = time => {
  const str = formatTimeString(time);
  const strArr = str.split(' ');
  return `${moment(strArr[0]).format('DD-MMM-YYYY')} ${strArr[1]}`;
};

export {
  userStatus,
  templateTypeFormat,
  timeFormat,
  lockedFormat,
  chartStatusFormat,
  dataChartFormat,
};
