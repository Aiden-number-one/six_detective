/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors: mus
 * @LastEditTime: 2019-12-12 13:31:15
 */

import fetch from '@/utils/request.default';

export default {
  namespace: 'reportDesigner',
  state: {
    contentDetail: '', // 报表设计器的JSON
  },
  effects: {
    *saveTaskGridContent(_, { call, select }) {
      const contentDetail = yield select(({ reportDesigner }) => reportDesigner.contentDetail);
      const params = {
        addSheetFormula: '',
        contentDetail,
        taskName: '新建表格',
        groupName: '新建表格',
        sheetInfo: '"[{"sheetName":"表格","sheetType":"0"}]"',
        isAllSave: '1',
      };
      yield call(fetch('set_task_grid_content_save'), params);
    },
  },
  reducers: {},
};
