/*
 * @Des: alert constant
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-12 14:08:57
 * @LastEditors: iron
 * @LastEditTime: 2019-12-12 15:31:35
 */
import { formatMessage } from 'umi/locale';

export const ALERT_STATUS = {
  0: formatMessage({ id: 'alert-center.processing' }),
  1: formatMessage({ id: 'alert-center.closed' }),
  9: formatMessage({ id: 'alert-center.invalid' }),
};

export const PHASES = [
  'All the data is problematic.',
  'Data correct,can be turned off.',
  'Remember to download all the attachments.',
  'Statistics are collected every Friday.',
  'Emai me before you turn off alert.',
];
