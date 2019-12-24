/*
 * @Des: alert task columns config
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-24 16:04:36
 * @LastEditors  : iron
 * @LastEditTime : 2019-12-24 16:32:17
 */
import { formatMessage } from 'umi/locale';

export const epColumns = [
  {
    dataIndex: 'EP_CODE',
    title: formatMessage({ id: 'alert-center.ep-code' }),
  },
  {
    dataIndex: 'EP_NAME',
    title: formatMessage({ id: 'alert-center.ep-name' }),
  },
];

export const proudctColumns = [
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
