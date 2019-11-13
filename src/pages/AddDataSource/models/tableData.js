/*
 * @Description: 获取数据源表格
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime: 2019-11-12 18:05:11
 * @LastEditors: lan
 */
import Service from '@/utils/Service';

const { getTableData, getMetaData } = Service;

export default {
  namespace: 'tableData',
  state: {
    tableData: [],
    metaData: [],
  },
  effects: {
    *getTableData({ payload }, { call, put }) {
      const response = yield call(getTableData, { param: payload });
      yield put({
        type: 'setTableData',
        payload: response.bcjson.items,
      });
    },
    *getMetaData({ payload }, { call, put }) {
      const response = yield call(getMetaData, { param: payload });
      yield put({
        type: 'setMetaData',
        payload: response.bcjson.items,
      });
    },
  },
  reducers: {
    setTableData(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    setMetaData(state, action) {
      return {
        ...state,
        metaData: action.payload,
      };
    },
    clearMetaData(state) {
      return {
        ...state,
        metaData: [],
      };
    },
  },
};
