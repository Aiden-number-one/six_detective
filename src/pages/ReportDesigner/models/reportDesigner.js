/*
 * @Author: your name
 * @Date: 2019-11-26 11:16:28
 * @LastEditTime: 2019-12-03 20:31:47
 * @LastEditors: mus
 * @Description: In User Settings Edit
 * @FilePath: \superlop-web-project\src\pages\ReportDesigner\models\reportDesigner.js
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
      console.log(items);
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
