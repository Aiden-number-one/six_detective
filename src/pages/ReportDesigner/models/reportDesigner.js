/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-28 17:10:22
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const { getDataSet, getReportTemplateContent, setReportTemplateContent } = Service;

export default {
  namespace: 'reportDesigner',
  state: {
    reportName: 'Untitled', // 当前报表设计器的名字
    reportTemplateContent: '', // 报表设计器的JSON
    reportId: '', // 报表设计器的id
    teamplateAreaObj: '', // 报表设计器表格区域的相关Object对象
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
    // 设置模板区域的Object
    setTemplateArea(state, action) {
      return {
        ...state,
        teamplateAreaObj: action.payload,
      };
    },
    // 设置报表模板的ID
    setReportId(state, action) {
      return {
        ...state,
        reportId: action.payload,
      };
    },
  },
  effects: {
    // 组装reportTemplateContent
    *packageTemplate(_, { select, call, put }) {
      // 报表模板ID Name 及 私有数据集
      const [reportId, reportName, dataSetPrivateList] = yield select(({ reportDesigner }) => [
        reportDesigner.reportId,
        reportDesigner.reportName,
        reportDesigner.dataSetPrivateList,
      ]);
      // 关于模板区域的Object
      const teamplateAreaObj = yield select(
        ({ reportDesigner }) => reportDesigner.teamplateAreaObj,
      );
      const reportTemplateContentObj = {
        report_id: reportId, // 新建为空
        report_name: reportName,
        report_description: '', // 暂无
        report_version: 'v1.0', // 默认1.0
        report_style: {}, // 暂无
        datasets: dataSetPrivateList, // 数据集相关
        paramsList: [], // 参数相关即查询条件相关
        queryArea: {}, // 查询条件相关
        templateArea: teamplateAreaObj,
      };
      const response = yield call(setReportTemplateContent, {
        param: {
          report_id: reportId,
          reportTemplateContent: JSON.stringify(reportTemplateContentObj),
        },
      });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setReportId',
          payload: response.bcjson.items[0].reportTemplateContent.report_id,
        });
        message.info(response.bcjson.msg);
      } else {
        message.warn(response.bcjson.msg);
      }
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
      yield put({
        type: 'setReportId',
        payload: payload.reportId,
      });
      if (response.bcjson.flag === '1' && response.bcjson.items[0]) {
        // TODO: 需要优化
        if (response.bcjson.items[0].reportTemplateContent.templateArea.originContentDetail) {
          const { reportTemplateContent } = response.bcjson.items[0];
          // 处理报表模板回显
          window.xsObj.instanceArray[0].loadData(
            reportTemplateContent.templateArea.originContentDetail,
          );
          // 处理私有数据集
          yield put({
            type: 'setDataSetPrivateList',
            payload: reportTemplateContent.datasets,
          });
        }
      }
    },
  },
};
