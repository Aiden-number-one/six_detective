/*
 * @Des: common constant
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 18:53:34
 * @LastEditors  : iron
 * @LastEditTime : 2019-12-27 16:06:21
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
export const reqFormat = 'YYYYMMDD';
export const dateFormat = 'DD-MMM-YYYY';
export const timeFormat = 'HH:mm:ss';
export const timestampFormat = `${dateFormat} ${timeFormat}`;

const yesterday = moment().subtract(1, 'days');
const today = moment();

export const defaultDateRange = [yesterday, today];
export const defaultMarket = ['HKFE', 'SEHK'];

export function downloadFile(url) {
  const aLink = document.createElement('a');
  aLink.download = true;
  aLink.href = `/download?filePath=${url}`;
  aLink.click();
}
