/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-15 21:19:05
 */
import { message } from 'antd';
import { createCellPos } from '@/utils/utils';
import Service from '@/utils/Service';
import {
  modifyTemplateAreaInside,
  getTemplateAreaCellPartXml,
  getColColumnXml,
  getDataSetXml,
} from '../utils';

const { getDataSet, getReportTemplateContent, setReportTemplateContent, importExcel } = Service;

export default {
  namespace: 'reportDesigner',
  state: {
    reportName: 'Untitled', // 当前报表设计器的名字
    reportTemplateContent: '', // 报表设计器的JSON
    reportId: '', // 报表设计器的id
    folderId: '', // 报表模板存放的文件夹id
    teamplateAreaObj: [], // 报表设计器表格区域的相关Object对象
    originTemplateAreaObj: {}, // xspreadsheet的原始数据
    dataSetPublicList: [], // 公共数据集列表
    dataSetPrivateList: [], // 私有数据集
    spreadsheetOtherProps: [], // spreadSheet的其他属性
    cellPosition: 'A1', // 当前的单元格
    showFmlModal: false, // 是否显示处理公式的模态框
    showHylModal: false, // 是否显示处理超链接的模态框
    rightSideCollapse: false, // 右边sideBar展开收起
    paging: true, // 是否分页
    description: '', // 报表描述
  },
  reducers: {
    // 修改报表描述
    changeDescription(state, action) {
      return {
        ...state,
        description: action.payload,
      };
    },
    // 修改分页属性
    changePaging(state, action) {
      return {
        ...state,
        paging: action.payload,
      };
    },
    // 删除私有数据集相关
    deleteDataSetPrivate(state, action) {
      return {
        ...state,
        dataSetPrivateList: state.dataSetPrivateList.filter(
          value => value.dataset_id !== action.payload,
        ),
      };
    },
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
    modifyDataSetPrivate(state, action) {
      const { dataSetId, props = {} } = action.payload;
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { query, dataset_name, dataset_type } = props;
      const { dataSetPrivateList } = state;
      const newdataSetPrivateList = dataSetPrivateList.map(value => {
        if (value.dataset_id === dataSetId) {
          return {
            ...value,
            dataset_name,
            dataset_type,
            query: {
              ...value.query,
              ...query,
            },
          };
        }
        return value;
      });
      return {
        ...state,
        dataSetPrivateList: newdataSetPrivateList,
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
        teamplateAreaObj: action.payload.contentDetail,
        originTemplateAreaObj: action.payload.changeData,
      };
    },
    // 修改模版区域的Object
    modifyTemplateArea(state, action) {
      return {
        ...state,
        spreadsheetOtherProps: modifyTemplateAreaInside({
          value: action.payload,
          position: action.cellPostion || state.cellPosition,
          spreadsheetOtherProps: state.spreadsheetOtherProps,
          deleteAll: !!action.deleteAll,
        }),
      };
    },
    // 插入一行
    modifySpreadsheetOtherPropsToDoInsertRow(state, action) {
      let newSpreadsheetOtherProps = [...state.spreadsheetOtherProps];
      if (newSpreadsheetOtherProps.length > 0) {
        const rowLength = newSpreadsheetOtherProps[0].length;
        const newRow = new Array(rowLength).fill('').map(() => ({}));
        newSpreadsheetOtherProps.splice(action.payload, 0, newRow);
      } else {
        newSpreadsheetOtherProps = [];
      }
      return {
        ...state,
        spreadsheetOtherProps: newSpreadsheetOtherProps,
      };
    },
    // 插入一列
    modifySpreadsheetOtherPropsToDoInsertColumn(state, action) {
      let newSpreadsheetOtherProps = [...state.spreadsheetOtherProps];
      if (newSpreadsheetOtherProps.length > 0) {
        newSpreadsheetOtherProps.forEach(value => {
          value.splice(action.payload, 0, {});
        });
      } else {
        newSpreadsheetOtherProps = [];
      }
      return {
        ...state,
        spreadsheetOtherProps: newSpreadsheetOtherProps,
      };
    },
    // 删除一行
    modifySpreadsheetOtherPropsToDoDeleteRow(state, action) {
      let newSpreadsheetOtherProps = [...state.spreadsheetOtherProps];
      if (newSpreadsheetOtherProps.length > 0) {
        newSpreadsheetOtherProps.splice(action.payload, 1);
      } else {
        newSpreadsheetOtherProps = [];
      }
      return {
        ...state,
        spreadsheetOtherProps: newSpreadsheetOtherProps,
      };
    },
    // 删除一列
    modifySpreadsheetOtherPropsToDoDeleteColumn(state, action) {
      let newSpreadsheetOtherProps = [...state.spreadsheetOtherProps];
      if (newSpreadsheetOtherProps.length > 0) {
        newSpreadsheetOtherProps.forEach(value => {
          value.splice(action.payload, 1);
        });
      } else {
        newSpreadsheetOtherProps = [];
      }
      return {
        ...state,
        spreadsheetOtherProps: newSpreadsheetOtherProps,
      };
    },
    // 设置报表模板的ID
    setReportId(state, action) {
      return {
        ...state,
        reportId: action.payload,
      };
    },
    // 修改报表模板id
    setFolderId(state, action) {
      return {
        ...state,
        folderId: action.payload,
      };
    },
    // 存储otherProps的相关属性 例如扩展方向相关
    setSpreadsheetOtherProps(state, action) {
      return {
        ...state,
        spreadsheetOtherProps: action.payload,
      };
    },
    // 修改cellPosition
    changeCellPosition(state, action) {
      const { rowIndex, columnIndex } = action.payload;
      const cellPosition = createCellPos(columnIndex) + (rowIndex + 1);
      return {
        ...state,
        cellPosition,
      };
    },

    // 展开或收起右侧菜单面板
    triggerRightSidebar(state, action) {
      const { showRightSidebar } = action.payload;
      return {
        ...state,
        rightSideCollapse: showRightSidebar,
      };
    },

    // 显示或隐藏处理公式的模态框
    triggerFmlModal(state, action) {
      const { showFmlModal } = action.payload;
      return {
        ...state,
        showFmlModal,
      };
    },

    // 显示或隐藏处理超链接的模态框
    triggerHylModal(state, action) {
      const { showHylModal } = action.payload;
      return {
        ...state,
        showHylModal,
      };
    },
  },
  effects: {
    // 组装reportTemplateContent
    *packageTemplate({ payload }, { select, call, put }) {
      // 报表模板ID Name 及 私有数据集
      const [
        reportId,
        dataSetPrivateList,
        teamplateAreaObj,
        originTemplateAreaObj,
        spreadsheetOtherProps,
        customSearchData,
        paging,
      ] = yield select(({ reportDesigner, formArea }) => [
        reportDesigner.reportId, // 报表模板id
        reportDesigner.dataSetPrivateList, // 私有数据集
        reportDesigner.teamplateAreaObj, // 报表模板区域数据
        reportDesigner.originTemplateAreaObj, // 报表模板区域原始数据
        reportDesigner.spreadsheetOtherProps, // 单元格otherProps
        formArea.customSearchData, // 查询条件区域
        reportDesigner.paging, // 查询区域是否分页
      ]);
      // 得到单元格的相关xml
      const templateAreaXml = getTemplateAreaCellPartXml(teamplateAreaObj, spreadsheetOtherProps);
      // 得到单元格宽高的相关xml
      const colsColumnsXml = getColColumnXml(teamplateAreaObj);
      // 得到数据集相关的xml
      const datasetXml = getDataSetXml(dataSetPrivateList);
      // 得到查询条件相关
      const reportTemplateContentObj = {
        report_id: reportId, // 新建为空
        report_name: payload.reportName,
        report_description: '', // 暂无
        report_version: 'v1.0', // 默认1.0
        datasets: dataSetPrivateList,
        templateArea: {
          xml: `<?xml version="1.0" encoding="UTF-8"?><ureport>${templateAreaXml}${colsColumnsXml}${datasetXml}<paper type="A4" left-margin="90" right-margin="90"
          top-margin="72" bottom-margin="72" paging-mode="fitpage" fixrows="0"
          width="595" height="842" orientation="portrait" html-report-align="left" bg-image=""
          html-interval-refresh-value="0" column-enabled="false"></paper></ureport>`,
          originTemplateAreaObj,
          spreadsheetOtherProps, // 单元格的一些问题相关 例如：数据集相关、公式相关
          customSearchData,
          paging,
          description: payload.description || '',
        },
      };
      const response = yield call(setReportTemplateContent, {
        param: {
          folderId: payload.folderId,
          reportId,
          reportTemplateContent: JSON.stringify(reportTemplateContentObj),
        },
      });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setReportId',
          payload: response.bcjson.items[0].reportTemplateContent.report_id,
        });
        yield put({
          type: 'changeReportName',
          payload: response.bcjson.items[0].reportTemplateContent.report_name,
        });
        // 处理报表id
        yield put({
          type: 'setFolderId',
          payload: payload.folderId,
        });
        // 处理des
        yield put({
          type: 'changeDescription',
          payload: payload.description,
        });
        window.history.pushState(
          null,
          null,
          `/report-designer?reportId=${response.bcjson.items[0].reportTemplateContent.report_id}`,
        );
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
    // 进行模版的导入
    *importExcel({ payload }, { call, put }) {
      const response = yield call(importExcel, { param: payload });
      if (response.bcjson.flag === '1') {
        return response.bcjson.items[0].reportDefinition;
      }
      message.info(response.bcjson.msg);
      return false;
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
        if (response.bcjson.items[0].reportTemplateContent.templateArea.originTemplateAreaObj) {
          const { reportTemplateContent, folderId } = response.bcjson.items[0];
          // 处理报表模板回显
          window.xsObj.instanceArray[0].loadData(
            reportTemplateContent.templateArea.originTemplateAreaObj,
          );
          // 处理SpreadsheetOtherProps
          yield put({
            type: 'setSpreadsheetOtherProps',
            payload: reportTemplateContent.templateArea.spreadsheetOtherProps || [],
          });
          // 处理查询区域部分
          yield put({
            type: 'formArea/setCustomSearchData',
            payload: reportTemplateContent.templateArea.customSearchData || [],
          });
          // 处理分页区域部分
          yield put({
            type: 'changePaging',
            payload: !!reportTemplateContent.templateArea.paging,
          });
          // 处理des
          yield put({
            type: 'changeDescription',
            payload: reportTemplateContent.templateArea.description || '',
          });
          // 处理私有数据集
          yield put({
            type: 'setDataSetPrivateList',
            payload: reportTemplateContent.datasets,
          });
          // 处理报表名
          yield put({
            type: 'changeReportName',
            payload: reportTemplateContent.report_name,
          });
          // 处理报表id
          yield put({
            type: 'setFolderId',
            payload: folderId,
          });
        }
      }
    },
  },
};
