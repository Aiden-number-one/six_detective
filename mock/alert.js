/*
 * @Des: alert mock data
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-03 16:32:36
 * @LastEditors: iron
 * @LastEditTime: 2019-12-10 21:07:46
 */
import { mp, mockRes } from './utils';

export default {
  [mp('get_alert_center_page_list')]: mockRes(100, [
    {
      alertId: '@id()',
      'alertType|1-2': 1,
      alertTime: 15982218188,
      alertDesc: '@paragraph',
      'alertStatus|0-6': 1,
      'itemsTotal|0-100': 18,
      tradeDate: '@date("yyyy-MM-dd")',
      owner: '@name',
      submitter: '@name',
      submissionTime: '@date("yyyy-MM-dd")',
    },
  ]),
  [mp('get_alert_item_list')]: mockRes(50, [
    {
      ALERT_ID: '@id',
      EP_NAME: '@string',
      ALERT_TYPE: 'New EP',
      EP_CODE: '1001',
      OWNER_ID: '@name',
      MARKET: '@name',
      STATUS: 'open',
      USER_NAME: null,
    },
  ]),
  [mp('get_alert_comment_list')]: mockRes(50, [
    {
      id: '@id',
      alertId: '@id',
      operateMode: '',
      commitTime: '@date("yyyy-MM-dd")',
      rowsCount: '0',
      filePath: null,
      commentContent: '@paragraph',
      fileList: null,
    },
  ]),
  [mp('get_alert_comment_list')]: mockRes(50, [
    {
      id: '@id',
      alertId: '@id',
      operateMode: '',
      commitTime: '@date("yyyy-MM-dd")',
      rowsCount: '0',
      filePath: null,
      commentContent: '@paragraph',
      fileList: null,
    },
  ]),
  [mp('get_alert_log_list')]: mockRes(50, [
    {
      id: '@id',
      log: '@paragraph',
      operateTime: '@date("yyyy-MM-dd")',
    },
  ]),
};
