/*
 * @Des: common constant
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 18:53:34
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-16 19:33:27
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

export const channelMap = {
  A: 'Auto Import',
  M: 'Manual Import',
};

export const defaultPage = 1;
export const defaultPageSize = 10;
export const pageSizeOptions = ['10', '20', '50', '100'];

export const rawDateFormat = 'YYYYMMDD';
export const rawTimestampFormat = 'YYYYMMDDHHmmss';

export const reqFormat = 'YYYYMMDD';
export const dateFormat = 'DD-MMM-YYYY';
export const timeFormat = 'HH:mm:ss';
export const timestampFormat = `${dateFormat} ${timeFormat}`;

export const yesterday = moment().subtract(1, 'days');
export const today = moment();

export const defaultDateRange = [yesterday, today];
export const defaultMarket = ['HKFE', 'SEHK'];

export function downloadFile(url) {
  const aLink = document.createElement('a');
  aLink.download = true;
  aLink.href = `/download?filePath=${encodeURIComponent(url)}`;
  aLink.click();
}
