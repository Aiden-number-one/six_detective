/*
 * @Description: all alert data
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-11 18:29:58
 * @LastEditors  : lan
 */
import Service from '@/utils/Service';

const {
  getInformation, // 获取my alert data
  getAlertCount, // 获取个人警告数
  getPerProcessingAlertCount, // 个人处理中的alert数
  // getClosedAlertCount, // 个人已关闭alert数
  getPerAlertData,
} = Service;

export default {
  namespace: 'perAlert',

  state: {
    perClaimAlertCount: 0, //  personal Claim alert 总数
    perProcessingAlertCount: 0, // personal Processing alert 总数
    perClosedAlertCount: 0, // personal Closed Alert 总数
    myAlertData: [], // my alert data
    perAlertData: [], // peralertchartdata
  },

  effects: {
    // 获取my alert的数据
    *getMyAlert({ payload }, { call, put }) {
      const response = yield call(getInformation, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'saveMyAlert',
          payload: response.bcjson.items,
        });
      }
    },
    // 获取个人已认领总数
    *getPerClaimAlertCount({ payload }, { call, put }) {
      const response = yield call(getAlertCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'savePerClaimAlertCount',
          payload: response.bcjson.items[0].count,
        });
      }
    },
    // 获取个人处理中总数
    *getPerProcessingAlertCount({ payload }, { call, put }) {
      const response = yield call(getPerProcessingAlertCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'savePerProcessingAlertCount',
          payload: response.bcjson.items[0].count,
        });
      }
    },
    // 获取个人的已关闭的alert的数据
    // *getPerClosedAlterCount({ payload }, { call, put }) {
    //   const response = yield call(getClosedAlertCount, { param: payload });
    //   if (response.bcjson.flag === '1') {
    //     if (response.bcjson.items) {
    //       yield put({
    //         type: 'savePerClosedAlterCount',
    //         payload: response.bcjson.items[0].count,
    //       });
    //     }
    //   }
    // },
    *getPerAlertData({ payload, callback }, { call, put }) {
      const response = yield call(getPerAlertData, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'savePerAlertData',
          payload: response.bcjson.items,
        });
        if (callback) callback();
      }
    },
  },

  reducers: {
    // baocun
    saveMyAlert(state, action) {
      return {
        ...state,
        myAlertData: action.payload,
      };
    },
    // 保存个人图表数据
    // 保存per closed alert总数
    // savePerClosedAlterCount(state, action) {
    //   return {
    //     ...state,
    //     perClosedAlertCount: action.payload,
    //   };
    // },
    savePerAlertData(state, action) {
      return {
        ...state,
        perAlertData: action.payload,
      };
    },
    savePerClaimAlertCount(state, action) {
      return {
        ...state,
        perClaimAlertCount: action.payload || 0,
      };
    },
    savePerProcessingAlertCount(state, action) {
      return {
        ...state,
        perProcessingAlertCount: action.payload || 0,
      };
    },
  },
};
