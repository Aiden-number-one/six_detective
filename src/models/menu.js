/*
 * @Description: menu modal
 * @Author: mus
 * @Date: 2019-09-19 17:03:33
 * @LastEditTime: 2019-11-30 19:09:35
 * @LastEditors: dailinbo
 * @Email: mus@szkingdom.com
 */
import Service from '@/utils/Service';
import { geneMenuData } from '@/utils/utils';

const { getMenu } = Service;

export default {
  namespace: 'menu',
  state: {
    menuData: [],
  },
  effects: {
    *getMenuData({ payload }, { call, put }) {
      const response = yield call(getMenu, { param: payload, version: 'v2.0' });
      const items = response.bcjson.items || [];
      const menuData = geneMenuData(items);
      yield put({
        type: 'save',
        payload: menuData,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        menuData: action.payload || [],
      };
    },
  },
};
