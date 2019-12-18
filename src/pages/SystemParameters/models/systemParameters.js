/*
 * @Description:
 * @Author: dailinbo
 * @Date: 2019-11-01 11:02:37
 * @LastEditors  : dailinbo
 * @LastEditTime : 2019-12-18 09:41:52
 */
import Service from '@/utils/Service';

const { systemParamsList, systemParamsUpdate, paramsType } = Service;
const systemParameters = {
  namespace: 'systemParams',
  state: {
    data: [],
    obj: {},
    getParamsData: [],
  },
  effects: {
    *getSystemParamsList({ payload }, { call, put }) {
      const response = yield call(systemParamsList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *systemParamsUpdate({ payload, callback }, { call, put }) {
      const response = yield call(systemParamsUpdate, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'updateDatas',
            payload: response.bcjson.items,
          });
        }
        callback();
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *getParamsType({ payload, callback }, { call, put }) {
      const response = yield call(paramsType, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getParamsData',
            payload: response.bcjson.items,
          });
        }
        // eslint-disable-next-line no-unused-expressions
        callback && callback();
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
    updateDatas(state, action) {
      return {
        ...state,
        obj: action.payload,
      };
    },
    getParamsData(state, action) {
      return {
        ...state,
        getParamsData: action.payload,
      };
    },
  },
};

export default systemParameters;
