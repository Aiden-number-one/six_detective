/*
 * @Description: menu modal
 * @Author: mus
 * @Date: 2019-09-19 17:03:33
 * @LastEditTime : 2020-01-02 18:58:00
 * @LastEditors  : dailinbo
 * @Email: mus@szkingdom.com
 */
import Service from '@/utils/Service';
import { geneMenuData } from '@/utils/utils';

const { getMenu, getTaskCount, getAlertCount } = Service;

export default {
  namespace: 'menu',
  state: {
    menuData: [],
    taskCount: 0,
    alertCount: 0,
  },
  effects: {
    *getMenuData({ payload, callback }, { call, put }) {
      const response = yield call(getMenu, { param: payload, version: 'v2.0' });
      const items = response.bcjson.items || [];
      const menuData = geneMenuData(items);
      yield put({
        type: 'save',
        payload: menuData,
      });
      const newItems = Object.assign([], items);
      const newMenu = Object.assign([], newItems[0].menu);
      for (let i = 0; i < newMenu.length; i += 1) {
        if (newMenu[i].menuid.indexOf('btn') > -1) {
          newMenu.splice(i, 1);
          i -= 1;
        }
      }
      newItems[0].menu = newMenu;
      callback(geneMenuData(newItems));
    },
    *getTaskCount({ payload }, { call, put }) {
      const response = yield call(getTaskCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'saveTaskCount',
          payload: response.bcjson.items[0].count,
        });
      }
    },
    *getAlertCount({ payload }, { call, put }) {
      const response = yield call(getAlertCount, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'saveAlertCount',
          payload: response.bcjson.items[0].count,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        menuData: action.payload || [],
      };
    },
    saveTaskCount(state, action) {
      return {
        ...state,
        taskCount: action.payload || 0,
      };
    },
    saveAlertCount(state, action) {
      return {
        ...state,
        alertCount: action.payload || 0,
      };
    },
  },
};
