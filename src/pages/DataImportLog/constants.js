/*
 * @Des: common constant
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 18:53:34
 * @LastEditors: iron
 * @LastEditTime: 2019-12-16 21:16:49
 */
import moment from 'moment';

export const PROCESSING_STATUS = [
  'wait for validation',
  'failed validation',
  'validated',
  'processing',
  'failed processing',
  'processed',
  'canceled',
];

export const SUBMISSION_REPORT = [
  'LOPBI',
  'LOPTO',
  'SOLBI',
  'SOLTO',
  'EXCESS POSITION LIMIT FOR ETF MARKET MAKERS REPORTING',
];

export const dateFormat = 'DD-MM-YYYY';
export const timeFormat = 'hh:mm:ss';
export const timestampFormat = `${dateFormat} ${timeFormat}`;

export const yesterday = moment().subtract(1, 'days');
export const today = moment();
