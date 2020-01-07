/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-28 17:03:03
 */
import Service from '@/utils/Service';

const { getReportTemplateDataQuery, getReportDataFile } = Service;

export default {
  namespace: 'reportDesignPreview',
  state: {
    previewData: {},
  },
  reducers: {
    // 保存报表预览数据
    savePreviewData(state, action) {
      return {
        ...state,
        previewData: action.payload,
      };
    },
  },
  effects: {
    // 查询报表预览
    *getReportTemplateDataQuery({ payload }, { call, put }) {
      const response = yield call(getReportTemplateDataQuery, {
        param: payload,
      });
      yield put({
        type: 'savePreviewData',
        payload: response.bcjson,
      });
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
