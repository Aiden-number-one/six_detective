/*
 * @Description: This is CodeMaintenance
 * @Author: dailinbo
 * @Date: 2019-11-04 12:56:45
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-06 21:19:11
 */
import Service from '@/utils/Service';

const { getDataProcessing } = Service;
const codeMaintenance = {
  namespace: 'dataProcessing',
  state: {
    data: [],
    itemData: [],
    itemsByPassData: {},
  },
  effects: {
    *getDataProcessing({ payload, callback }, { call, put }) {
      const response = yield call(getDataProcessing, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
        callback();
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *getDataProcessingItem({ payload }, { call, put }) {
      const response = yield call(getDataProcessing, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getItemDatas',
            payload: response.bcjson,
          });
        }
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *alertItemsByPass({ payload, callback }, { call, put }) {
      const response = yield call(getDataProcessing, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'itemsByPass',
            payload: response.bcjson,
          });
        }
        callback();
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
  },
  reducers: {
    getDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getItemDatas(state, action) {
      return {
        ...state,
        itemData: action.payload,
      };
    },
    itemsByPass(state, action) {
      return {
        ...state,
        itemsByPassData: action.payload,
      };
    },
  },
};

export default codeMaintenance;
