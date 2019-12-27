/*
 * @Des: 报表设计器的Model
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-02 16:36:09
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-26 15:44:45
 */
import Service from '@/utils/Service';

const { getReportTemplateDataQuery } = Service;

export default {
  namespace: 'reportDesignPreview',
  state: {
    previewData: '<div></div>',
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
        payload: response,
      });
    },
  },
};
