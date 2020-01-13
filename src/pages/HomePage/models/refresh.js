/*
 * @Description: refresh Time
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-13 19:28:45
 * @LastEditors  : lan
 */
import Service from '@/utils/Service';

const {
  getRefreshTime, // 获取刷新时间
} = Service;

export default {
  namespace: 'refresh',

  state: {
    refreshTime: 60, // 刷新书简
  },

  effects: {
    // 获取刷新时间
    *getRefreshTime({ payload, callback }, { call, put }) {
      const response = yield call(getRefreshTime, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setRefreshTime',
          payload: response.bcjson.items[0] ? response.bcjson.items[0].parameterValue : 60,
        });
        if (callback) {
          callback(response.bcjson.items[0] ? response.bcjson.items[0].parameterValue : 60);
        }
      }
    },
  },

  reducers: {
    // 获取刷新时间
    setRefreshTime(state, action) {
      return {
        ...state,
        refreshTime: action.payload,
      };
    },
  },
};
