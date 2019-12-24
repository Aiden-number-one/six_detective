/*
 * @Description: 获取报表列表
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime : 2019-12-23 13:33:41
 * @LastEditors  : mus
 */
import Service from '@/utils/Service';

const { getReportTemplateList } = Service;

export default {
  namespace: 'reportList',
  state: {
    reportList: [], // 报表模板列表
  },
  effects: {
    // 获取数据集
    *getReportList({ payload }, { call, put }) {
      const response = yield call(getReportTemplateList, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据集
        yield put({
          type: 'setReportList',
          payload: response.bcjson.items,
        });
      }
    },
  },
  reducers: {
    setReportList(state, action) {
      return {
        ...state,
        reportList: action.payload,
      };
    },
  },
};
