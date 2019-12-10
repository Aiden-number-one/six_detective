/*
 * @Des: alert mock data
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-03 16:32:36
 * @LastEditors: iron
 * @LastEditTime: 2019-12-07 10:01:49
 */
import { mp, mockRes } from './utils';

export default {
  [mp('alerts')]: mockRes(100, [
    {
      alertId: '@guid',
      'alertType|1-2': 1,
      alertTime: 15982218188,
      alertDesc: '@paragraph',
      'alertStatus|0-6': 1,
      'itemsTotal|0-100': 18,
      tradeDate: '@date("yyyy-MM-dd")',
      owner: '@name',
      submitter: '@name',
      // 'handleToday|0-1': 0,
      submissionTime: '@date("yyyy-MM-dd")',
      // 'comments|1-50': [
      //   {
      //     time: '@datetime',
      //     text: '@paragraph',
      //     'attachments|1-8': [
      //       {
      //         name: '@title',
      //         url: '@url',
      //       },
      //     ],
      //   },
      // ],
      // 'tasks|1-50': [
      //   {
      //     market: 'HEFE',
      //     epCode: '@string',
      //     epName: 'ICBC',
      //     owner: '@name',
      //     'status|0-6': 2,
      //   },
      // ],
      // 'logs|1-10': [{ time: '@datetime', text: '@paragraph' }],
    },
  ]),
};
