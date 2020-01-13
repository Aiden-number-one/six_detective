/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-13 11:27:05
 */
import Service from '@/utils/Service';

const { getReportTemplateDataQuery, getReportDataFile, getMetadataTablePerform } = Service;

export default {
  namespace: 'reportDesignPreview',
  state: {
    previewData: {},
    dataSetColumn: {},
  },
  reducers: {
    // 保存报表预览数据
    savePreviewData(state, action) {
      return {
        ...state,
        previewData: action.payload,
      };
    },
    changeDataSetColumn(state, action) {
      return {
        ...state,
        dataSetColumn: action.payload,
      };
    },
  },
  effects: {
    // 获取数据集下或表的字段的值
    *getDataSetColumnValue({ payload }, { call, put, all, select }) {
      const selectOptionArray = yield all(
        payload.map(value => call(getMetadataTablePerform, { param: value })),
      );
      const dataSetColumnState = yield select(
        ({ reportDesignPreview }) => reportDesignPreview.dataSetColumn,
      );
      const dataSetColumn = { ...dataSetColumnState };
      selectOptionArray.forEach(value => {
        if (value.bcjson.flag === '1' && value.bcjson.items.length > 0) {
          const key = Object.keys(value.bcjson.items[0])[0];
          dataSetColumn[key] = value.bcjson.items.map(item => item[key]);
        }
      });
      yield put({
        type: 'changeDataSetColumn',
        payload: dataSetColumn,
      });
    },
    // 查询报表预览
    *getReportTemplateDataQuery({ payload }, { call, put }) {
      const response = yield call(getReportTemplateDataQuery, {
        param: payload,
      });
      if (response.bcjson.flag === '1') {
        // 存放预览数据
        yield put({
          type: 'savePreviewData',
          payload: response.bcjson,
        });
        const [tableData, rowCountAndTemplateArea] = response.bcjson.items;
        const { templateArea = {} } = rowCountAndTemplateArea || {};
        const { customSearchData = [] } = templateArea;
        // Option需要从dataset中获取
        const datasetOption = customSearchData
          .filter(value => value.sourceType === 'dataset')
          .map(value => ({
            datasetId: value.datasetName,
            fieldName: value.datacolumn,
          }));
        const tableOption = customSearchData
          .filter(value => value.sourceType === 'table')
          .map(value => ({
            datasourceId: value.datasource,
            fieldName: value.tablecolumn,
            tableName:
              value.table.split('.').length === 3
                ? `${value.table.split('.')[0]}.${value.table.split('.')[1]}`
                : '',
          }));
        yield put({
          type: 'getDataSetColumnValue',
          payload: [...datasetOption, ...tableOption],
        });
      } else {
        throw new Error(response.bcjson.msg);
      }
    },

    // 导出报表文件
    *fetchExportFile({ payload, callback }, { call }) {
      const response = yield call(getReportDataFile, {
        param: payload,
      });
      if (response.bcjson.flag === '1') {
        callback(response.bcjson.items[0].filePath);
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
  },
};
