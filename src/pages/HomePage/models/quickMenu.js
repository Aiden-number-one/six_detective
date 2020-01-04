/*
 * @Description: quick menu
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-03 18:43:28
 * @LastEditors  : lan
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getQuickMenu, // 获取快捷菜单
  saveQuickMenu, // 设置快捷菜单
} = Service;

export default {
  namespace: 'quickMenu',

  state: {
    quickMenuData: [], // 快捷菜单keys
  },

  effects: {
    // 获取快捷菜单
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
    // 设置快捷菜单
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
    // 获取快捷菜单Keys
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
