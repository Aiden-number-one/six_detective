/*
 * @Des: alert constant
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-12 14:08:57
 * @LastEditors: iron
 * @LastEditTime: 2019-12-12 14:19:13
 */
import { formatMessage } from 'umi/locale';

export const ALERT_STATUS = {
  0: formatMessage({ id: 'alert-center.processing' }),
  1: formatMessage({ id: 'alert-center.closed' }),
  9: formatMessage({ id: 'alert-center.invalid' }),
};
