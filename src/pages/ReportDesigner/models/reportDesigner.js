/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-23 10:17:06
 */

import Service from '@/utils/Service';

const { getDataSet, setTaskGridContent } = Service;

export default {
  namespace: 'reportDesigner',
  state: {
    reportName: 'Untitled', // 当前报表设计器的名字
    reportTemplateContent: '', // 报表设计器的JSON
    dataSetPublicList: [], // 公共数据集列表
    dataSetPrivateList: [], // 私有数据集
  },
  reducers: {
    // 设置报表设计器的名字
    changeReportName(state, action) {
      return {
        ...state,
        reportName: action.payload,
      };
    },
    // 设置公共数据集
    setDataSetPublicList(state, action) {
      return {
        ...state,
        dataSetPublicList: action.payload,
      };
    },
    // 设置私有数据集
    setDataSetPrivateList(state, action) {
      return {
        ...state,
        dataSetPrivateList: action.payload,
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
    // 组装reportTemplateContent
    *getReportTemplateContent(_, { select }) {
      const reportName = yield select(({ reportDesigner }) => reportDesigner.reportTemplateContent);
      console.log(reportName);
    },
    // 获取数据集的列
    *getDataSetColumn() {
      //
    },
    // 获取数据集的Sql Params
    *getDataSetSqlParams() {
      //
    },
    // 获取公共数据集
    *getPublicDataSet({ payload }, { call, put }) {
      const response = yield call(getDataSet, { param: payload });
      let dataSetList = [];
      if (response.bcjson.flag === '1') {
        dataSetList = response.bcjson.items;
      }
      // 保存数据集
      yield put({
        type: 'setDataSetPublicList',
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
