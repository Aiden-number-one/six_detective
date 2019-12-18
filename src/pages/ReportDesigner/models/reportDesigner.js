/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors: mus
 * @LastEditTime: 2019-12-17 17:26:38
 */

import Service from '@/utils/Service';

const { getDataSet, setTaskGridContent } = Service;

export default {
  namespace: 'reportDesigner',
  state: {
    contentDetail: '', // 报表设计器的JSON
    dataSetList: [], // 数据集列表
    dataSetListColumn: [''], // 数据集的列
    dataSetListSqlParams: [''], // 数据集的
  },
  reducers: {
    // 设置数据集
    setDataSetList(state, action) {
      return {
        ...state,
        dataSetList: action.payload,
      };
    },
    // 设置数据集的列
    setDataSetColumn(state, action) {
      return {
        ...state,
        dataSetListColumn: action.payload,
      };
    },
    // 设置数据集的Sql Params
    setDataSetSqlParams(state, action) {
      return {
        ...state,
        dataSetListSqlParams: action.payload,
      };
    },
  },
  effects: {
    // 获取数据集的列
    *getDataSetColumn() {
      //
    },
    // 获取数据集的Sql Params
    *getDataSetSqlParams() {
      //
    },
    // 获取数据集
    *getDataSet({ payload }, { call, put }) {
      const response = yield call(getDataSet, { param: payload });
      let dataSetList = [];
      if (response.bcjson.flag === '1') {
        dataSetList = response.bcjson.items;
      }
      // 保存数据集
      yield put({
        type: 'setDataSetList',
        payload: dataSetList,
      });
    },
    // 新建表格任务
    *saveTaskGridContent(_, { call, select }) {
      const contentDetail = yield select(({ reportDesigner }) => reportDesigner.contentDetail);
      const param = {
        addSheetFormula: '',
        contentDetail,
        taskName: '新建表格',
        groupName: '新建表格',
        sheetInfo: '"[{"sheetName":"表格","sheetType":"0"}]"',
        isAllSave: '1',
      };
      yield call(setTaskGridContent, { param });
    },
  },
};
