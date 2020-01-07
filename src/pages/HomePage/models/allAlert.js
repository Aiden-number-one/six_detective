/*
 * @Description: all alert data
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-07 09:26:58
 * @LastEditors  : lan
 */
import Service from '@/utils/Service';

const {
  getAllAlterData, // 获取全部的alert的数据
  getAlertCount, // 获取全部警告数
  getClaimAlertCount, // 全部已认领的alert数
  getAllProcessingAlertCount, // 全部处理中的alert数
} = Service;

export default {
  namespace: 'allAlert',

  state: {
    allAlterData: [], // 全部的alert的数据
    allAlertCount: 0, // all alert总数
    allOutstandingALertCount: 0, // all outstanding alert 总数
    allClaimAlertCount: 0, //  all Claim alert 总数
    allProcessingAlertCount: 0, // all Processing alert 总数
  },

  effects: {
    // 获取全部alert总数
    *getAllAlertCount({ payload }, { call, put }) {
      const response = yield call(getAlertCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'saveAllAlertCount',
          payload: response.bcjson.items[0].count,
        });
      }
    },
    // 获取全部未认领总数
    *getAllOutstandingALertCount({ payload }, { call, put }) {
      const response = yield call(getClaimAlertCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'saveAllOutstandingALertCount',
          payload: response.bcjson.items[0].count,
        });
      }
    },
    // 获取全部已认领总数
    *getAllClaimAlertCount({ payload }, { call, put }) {
      const response = yield call(getClaimAlertCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'saveAllClaimAlertCount',
          payload: response.bcjson.items[0].count,
        });
      }
    },
    // 获取全部处理中总数
    *getAllProcessingAlertCount({ payload }, { call, put }) {
      const response = yield call(getAllProcessingAlertCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'saveAllProcessingAlertCount',
          payload: response.bcjson.items[0].count,
        });
      }
    },
    // 获取全部的alert的数据
    *getAllAlterData({ payload, callback }, { call, put }) {
      const response = yield call(getAllAlterData, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'saveAllAlterData',
            payload: response.bcjson.items,
          });
          if (callback && response.bcjson.items[0]) callback(response.bcjson.items);
        }
      }
    },
  },

  reducers: {
    //
    saveAllAlterData(state, action) {
      return {
        ...state,
        allAlterData: action.payload,
      };
    },
    // 保存all alert总数
    saveAllAlertCount(state, action) {
      return {
        ...state,
        allAlertCount: action.payload || 0,
      };
    },
    // 保存all outstanding总数
    saveAllOutstandingALertCount(state, action) {
      return {
        ...state,
        allOutstandingALertCount: action.payload || 0,
      };
    },
    saveAllClaimAlertCount(state, action) {
      return {
        ...state,
        allClaimAlertCount: action.payload || 0,
      };
    },
    saveAllProcessingAlertCount(state, action) {
      return {
        ...state,
        allProcessingAlertCount: action.payload || 0,
      };
    },
  },
};
