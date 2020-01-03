/*
 * @Description: all alert data
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-03 11:09:56
 * @LastEditors  : lan
 */
import Service from '@/utils/Service';

const {
  getQuickMenu, // 获取个人警告数
  getPerProcessingAlertCount, // 个人处理中的alert数
} = Service;

export default {
  namespace: 'perAlert',

  state: {
    perClaimAlertCount: 0, //  personal Claim alert 总数
    perProcessingAlertCount: 0, // personal Processing alert 总数
  },

  effects: {
    // 获取个人已认领总数
    *getQuickMenu({ payload }, { call, put }) {
      const response = yield call(getQuickMenu, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'saveQuickMenu',
          payload: response.bcjson.items,
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
  },

  reducers: {
    // 保存per closed alert总数
    saveQuickMenu(state, action) {
      return {
        ...state,
        perClosedAlertCount: action.payload,
      };
    },
    savePerClaimAlertCount(state, action) {
      return {
        ...state,
        perClaimAlertCount: action.payload || 0,
      };
    },
  },
};
