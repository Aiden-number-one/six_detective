/*
 * @Description: menu modal
 * @Author: mus
 * @Date: 2019-09-19 17:03:33
 * @LastEditTime: 2019-09-20 18:13:25
 * @LastEditors: lan
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
      const response = yield call(getMenu, { param: payload });
      const items = response.kdjson.items || [];
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
