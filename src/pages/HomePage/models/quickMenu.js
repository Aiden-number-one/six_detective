/*
 * @Description: all alert data
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-03 18:16:13
 * @LastEditors  : lan
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getQuickMenu, // 获取个人警告数
  saveQuickMenu, // 个人处理中的alert数
} = Service;

export default {
  namespace: 'quickMenu',

  state: {
    quickMenuData: [], //  personal Claim alert 总数
  },

  effects: {
    // 获取个人已认领总数
    *getQuickMenu({ payload, callback }, { call, put }) {
      const response = yield call(getQuickMenu, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setQuickMenu',
          payload: response.bcjson.items,
        });
        if (callback) callback(response.bcjson.items);
      }
    },
    // 获取个人处理中总数
    *saveQuickMenu({ payload, callback }, { call, put }) {
      const response = yield call(saveQuickMenu, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success(response.bcjson.msg);
        yield put({
          type: 'getQuickMenu',
          callback,
        });
      }
    },
  },

  reducers: {
    // 保存per closed alert总数
    setQuickMenu(state, action) {
      const quickMenuData = [];
      action.payload.forEach(item => quickMenuData.push(item.menuid));
      return {
        ...state,
        quickMenuData,
      };
    },
  },
};
