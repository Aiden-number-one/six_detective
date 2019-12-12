/*
 * @Des: alert mock data
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-03 16:32:36
 * @LastEditors: iron
 * @LastEditTime: 2019-12-12 10:20:07
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
      userName: '@name',
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
  [mp('get_alert_comment_list')]: mockRes(1, [
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
  [mp('get_table_column_filter_list')]: mockRes(60, ['1', '2', '3']),
  [mp('set_alert_comment')]: mockRes(1, []),
  [mp('set_alert_claim')]: mockRes(1, []),
  [mp('set_alert_close')]: mockRes(1, []),
  [mp('get_user_list_information')]: mockRes(50, [
    {
      userId: '@guid',
      userName: '@name',
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
