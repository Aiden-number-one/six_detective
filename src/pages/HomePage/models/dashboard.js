/*
 * @Description: quick menu
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-06 19:39:38
 * @LastEditors  : lan
 */
import Service from '@/utils/Service';

const {
  getFileCountByDate,
  getMarketData, // 获取MarketData
  getMarketDataByCategory, // 点击环图获取数据
  getProcessingStageData, //
  getLateReportFileCount,
  getOutstandingReportFileCount,
} = Service;

export default {
  namespace: 'dashboard',

  state: {
    fileCountData: [],
    marketData: [], // MarketData
    marketDataByCategory: [],
    processingStageData: [],
    lateReportFileCount: [],
    outstandingReportFileCount: [],
  },

  effects: {
    //
    *getFileCountByDate({ payload }, { call, put }) {
      const response = yield call(getFileCountByDate, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setFileCountByDate',
          payload: response.bcjson.items,
        });
        const { currentTradeDate } = response.bcjson.items[0];
        const tradeDate = Object.keys(currentTradeDate)[0];
        yield put({
          type: 'getLateReportFileCount',
          payload: {
            tradeDate,
          },
        });
        yield put({
          type: 'getOutstandingReportFileCount',
          payload: {
            tradeDate,
          },
        });
      }
    },
    //
    *getLateReportFileCount({ payload, callback }, { call, put }) {
      const response = yield call(getLateReportFileCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setLateReportFileCount',
          payload: response.bcjson.items,
        });
        if (callback) callback();
      }
    },
    //
    *getOutstandingReportFileCount({ payload }, { call, put }) {
      const response = yield call(getOutstandingReportFileCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setOutstandingReportFileCount',
          payload: response.bcjson.items,
        });
      }
    },
    //
    *getMarketData({ payload }, { call, put }) {
      const response = yield call(getMarketData, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setMarketData',
          payload: response.bcjson.items,
        });
      }
    },
    *getMarketDataByCategory({ payload, callback }, { call, put }) {
      const response = yield call(getMarketDataByCategory, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setMarketDataByCategory',
          payload: response.bcjson.items,
        });
        if (callback) callback();
      }
    },
    *getProcessingStageData({ payload }, { call, put }) {
      const response = yield call(getProcessingStageData, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setProcessingStageData',
          payload: response.bcjson.items,
        });
      }
    },
  },

  reducers: {
    setFileCountByDate(state, action) {
      return {
        ...state,
        fileCountData: action.payload,
      };
    },
    setLateReportFileCount(state, action) {
      return {
        ...state,
        lateReportFileCount: action.payload,
      };
    },
    setOutstandingReportFileCount(state, action) {
      return {
        ...state,
        outstandingReportFileCount: action.payload,
      };
    },
    // 保存MarketData
    setMarketData(state, action) {
      return {
        ...state,
        marketData: action.payload,
      };
    },
    // 保存MarketData
    setMarketDataByCategory(state, action) {
      return {
        ...state,
        marketDataByCategory: action.payload,
      };
    },
    //
    setProcessingStageData(state, action) {
      return {
        ...state,
        processingStageData: action.payload,
      };
    },
  },
};
