/*
 * @Description: menu modal
 * @Author: mus
 * @Date: 2019-09-19 17:03:33
 * @LastEditTime : 2020-01-19 18:44:59
 * @LastEditors  : dailinbo
 * @Email: mus@szkingdom.com
 */
import Service from '@/utils/Service';
import { geneMenuData } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';
// import authData from './auth.json';

const { getMenu, getAdminMenu, getTaskCount, getAlertCount } = Service;

export default {
  namespace: 'menu',
  state: {
    menuData: [],
    adminMenuData: [],
    taskCount: 0,
    alertCount: 0,
  },
  effects: {
    *getMenuData({ payload, callback, errorFn }, { call, put }) {
      const response = yield call(getMenu, { param: payload, version: 'v2.0' });
      if (response.bcjson.flag !== '1') {
        if (errorFn) errorFn();
        return;
      }
      const items = response.bcjson.items || [];
      let menuData = geneMenuData(items);
      menuData = menuData.filter(element => !element.menuid.includes('btn'));
      yield put({
        type: 'save',
        payload: menuData,
      });
      const newItems = Object.assign([], items);
      const newMenu = Object.assign([], newItems[0].menu);
      const btnArray = [];
      for (let i = 0; i < newMenu.length; i += 1) {
        if (newMenu[i].menuid.indexOf('btn') > -1) {
          btnArray.push(newMenu.splice(i, 1));
          i -= 1;
        }
      }
      const authBtn = {};
      btnArray.forEach(element => {
        authBtn[`auth${element[0].menuname}`] = element[0].isShow === 'true';
      });
      console.log('authBtn====', authBtn);
      setAuthority(authBtn);
      newItems[0].menu = newMenu;
      console.log('geneMenuData(newItems)===', geneMenuData(newItems));
      callback(geneMenuData(newItems), newItems[0].menu);
    },
    *getAdminMenuData({ payload, callback, errorFn }, { call, put }) {
      const response = yield call(getAdminMenu, { param: payload, version: 'v2.0' });
      if (response.bcjson.flag !== '1') {
        if (errorFn) errorFn();
        return;
      }
      const items = [{ menu: null }];
      items[0].menu = Object.assign([], response.bcjson.items);
      const menuData = geneMenuData(items);
      yield put({
        type: 'adminMenu',
        payload: menuData,
      });
      callback(response.bcjson.items);
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
    adminMenu(state, action) {
      return {
        ...state,
        adminMenuData: action.payload || [],
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
