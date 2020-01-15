/*
 * @Description: This is CodeMaintenance
 * @Author: dailinbo
 * @Date: 2019-11-04 12:56:45
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-15 14:42:41
 */
import Service from '@/utils/Service';

const {
  getDataProcessing,
  startProcessing,
  progressChart,
  progressStatus,
  progressBar,
  alertByPass,
} = Service;
const codeMaintenance = {
  namespace: 'dataProcessing',
  state: {
    data: [],
    itemData: [],
    alertItemData: [],
    itemsByPassData: {},
    startProcessingData: {},
    marketData: [],
    chartData: [],
    statusData: {},
    barData: {},
    byPassAllData: {},
    byPassSumData: {},
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
    *getDataProcessingItem({ payload, callback }, { call, put }) {
      const response = yield call(getDataProcessing, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getItemDatas',
            payload: response.bcjson,
          });
          callback();
        }
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *getAlertItemData({ payload, callback }, { call, put }) {
      const response = yield call(getDataProcessing, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getAlertItem',
            payload: response.bcjson,
          });
          callback();
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
    *startProcessing({ payload, callback, errorFn }, { call, put }) {
      const response = yield call(startProcessing, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getStartProcessing',
            payload: response.bcjson.items,
          });
          callback();
        }
      } else {
        errorFn();
        throw new Error(response.bcjson.msg);
      }
    },
    *getMarket({ payload, callback }, { call, put }) {
      const response = yield call(getDataProcessing, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'market',
            payload: response.bcjson.items,
          });
          callback();
        }
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *getProgressChart({ payload, callback }, { call, put }) {
      const response = yield call(progressChart, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getChart',
            payload: response.bcjson.items,
          });
          callback();
        }
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *getProgressStatus({ payload, callback, errorFn }, { call, put }) {
      const response = yield call(progressStatus, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getStatus',
            payload: response.bcjson.items,
          });
          callback();
        }
      } else {
        errorFn();
        throw new Error(response.bcjson.msg);
      }
    },
    *getProgressBar({ payload, callback, errorFn }, { call, put }) {
      const response = yield call(progressBar, { param: payload });
      if (!response.bcjson) {
        errorFn();
      }
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getBar',
            payload: response.bcjson.items,
          });
          callback();
        }
      } else {
        errorFn();
        throw new Error(response.bcjson.msg);
      }
    },
    *getByPassAll({ payload, callback, errorFn }, { call, put }) {
      const response = yield call(alertByPass, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'byPassAll',
            payload: response.bcjson.items,
          });
          callback();
        }
      } else {
        errorFn();
        throw new Error(response.bcjson.msg);
      }
    },
    *getByPassSum({ payload, callback, errorFn }, { call, put }) {
      const response = yield call(alertByPass, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'byPassSum',
            payload: response.bcjson.items,
          });
          callback();
        }
      } else {
        errorFn();
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
    getAlertItem(state, action) {
      return {
        ...state,
        alertItemData: action.payload,
      };
    },
    itemsByPass(state, action) {
      return {
        ...state,
        itemsByPassData: action.payload,
      };
    },
    getStartProcessing(state, action) {
      return {
        ...state,
        startProcessingData: action.payload,
      };
    },
    market(state, action) {
      return {
        ...state,
        marketData: action.payload,
      };
    },
    getChart(state, action) {
      return {
        ...state,
        chartData: action.payload,
      };
    },
    getStatus(state, action) {
      return {
        ...state,
        statusData: action.payload,
      };
    },
    getBar(state, action) {
      return {
        ...state,
        barData: action.payload,
      };
    },
    byPassAll(state, action) {
      return {
        ...state,
        byPassAllData: action.payload,
      };
    },
    byPassSum(state, action) {
      return {
        ...state,
        byPassSumData: action.payload,
      };
    },
  },
};

export default codeMaintenance;
