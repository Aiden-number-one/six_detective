/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-24 10:32:05
 */

import Service from '@/utils/Service';

const { getDataSet, getReportTemplateContent } = Service;
// setReportTemplateContent

export default {
  namespace: 'reportDesigner',
  state: {
    reportName: 'Untitled', // 当前报表设计器的名字
    reportTemplateContent: '', // 报表设计器的JSON
    teamplateAreaJson: '', // 报表设计器表格区域的相关JSON串
    dataSetPublicList: [], // 公共数据集列表
    dataSetPrivateList: [], // 私有数据集
  },
  reducers: {
    // 设置报表模板的JSON串
    setReportTemplateContent(state, action) {
      return {
        ...state,
        reportTemplateContent: action.payload,
      };
    },
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
    // 设置json串
    setTemplateArea(state, action) {
      return {
        ...state,
        teamplateAreaJson: action.payload,
      };
    },
  },
  effects: {
    // 组装reportTemplateContent
    *packageTemplate(_, { select }) {
      const reportName = yield select(({ reportDesigner }) => reportDesigner.reportTemplateContent);
      console.log(reportName);
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
    // 查询报表模板
    *getReportTemplateContent({ payload }, { call, put }) {
      const response = yield call(getReportTemplateContent, { param: payload });
      if (response.bcjson.flag === '1' && response.bcjson.items[0]) {
        yield put({
          type: 'setReportTemplateContent',
          payload: JSON.stringify(response.bcjson.items[0].reportTemplateContent),
        });
      }
    },
  },
};
