/*
 * @Des: common constant
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 18:53:34
 * @LastEditors: iron
 * @LastEditTime: 2019-12-07 19:48:34
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

export const dateFormat = 'MM-DD-YYYY';

export const yesterday = moment().subtract(1, 'days');
export const today = moment();
