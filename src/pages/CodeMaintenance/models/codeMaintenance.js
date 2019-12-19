/*
 * @Description: This is CodeMaintenance
 * @Author: dailinbo
 * @Date: 2019-11-04 12:56:45
 * @LastEditors  : dailinbo
 * @LastEditTime : 2019-12-18 09:43:47
 */
import Service from '@/utils/Service';

const { getSystemCode } = Service;
const codeMaintenance = {
  namespace: 'codeList',
  state: {
    data: [],
    itemData: [],
    obj: {},
    objDelete: {},
  },
  effects: {
    *getCodeList({ payload, callback }, { call, put }) {
      const response = yield call(getSystemCode, { param: payload });
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
    *getCodeItemList({ payload }, { call, put }) {
      const response = yield call(getSystemCode, { param: payload });
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
    *addCodeItem({ payload, callback }, { call, put }) {
      const response = yield call(getSystemCode, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson,
          });
        }
        callback();
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *deleteCodeItem({ payload, callback }, { call, put }) {
      const response = yield call(getSystemCode, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson) {
          yield put({
            type: 'deleteDatas',
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
    setDatas(state, action) {
      return {
        ...state,
        obj: action.payload,
      };
    },
    deleteDatas(state, action) {
      return {
        ...state,
        objDelete: action.payload,
      };
    },
  },
};

export default codeMaintenance;
