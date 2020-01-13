/*
 * @Des: alert task columns config
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-24 16:04:36
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-11 22:21:54
 */
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { dateFormat } from '@/pages/DataImportLog/constants';

export const epColumns = [
  {
    dataIndex: 'EP_CODE',
    title: formatMessage({ id: 'alert-center.ep-code' }),
  },
  {
    ellipsis: true,
    dataIndex: 'EP_NAME',
    title: formatMessage({ id: 'alert-center.ep-name' }),
  },
];

export const proudctColumns = [
  {
    dataIndex: 'TRADE_DATAE',
    title: formatMessage({ id: 'alert-center.trade-date' }),
    render: text => moment(text).format(dateFormat),
  },
  {
    dataIndex: 'PRODUCT_CODE',
    title: formatMessage({ id: 'alert-center.product-code' }),
  },
  {
    dataIndex: 'PRODUCT_CATEGROY',
    title: formatMessage({ id: 'alert-center.product-category' }),
  },
];

export const caCodeColumns = [
  {
    dataIndex: 'EFFECTIVE_DATE',
    title: formatMessage({ id: 'alert-center.effective-date' }),
    render: text => moment(text).format(dateFormat),
  },
  {
    dataIndex: 'CA_PRODUCT_CODE',
    title: formatMessage({ id: 'alert-center.original-product-code' }),
  },
  {
    dataIndex: 'EXPIRY_DATE',
    title: formatMessage({ id: 'alert-center.expiry-date' }),
  },
];

export const newAccountColumns = [
  {
    dataIndex: 'SUBMITTER_CODE',
    title: formatMessage({ id: 'alert-center.submitter-code' }),
  },
  {
    width: 140,
    ellipsis: true,
    dataIndex: 'SUBMITTER_NAME',
    title: formatMessage({ id: 'alert-center.submitter-name' }),
  },
];
