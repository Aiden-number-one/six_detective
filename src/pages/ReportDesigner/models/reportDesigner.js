/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors: mus
 * @LastEditTime: 2019-12-05 09:45:26
 */

import fetch from '@/utils/request.default';

export default {
  namespace: 'reportDesigner',
  state: {
    contentDetail: '', // 报表设计器的JSON
    customSearchData: [
      {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        i: '0',
      },
    ], // 查询控件的数据
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
      const { items } = yield call(fetch('set_task_grid_content_save'), params);
    },
  },
  reducers: {
    changeCustomSearchData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
