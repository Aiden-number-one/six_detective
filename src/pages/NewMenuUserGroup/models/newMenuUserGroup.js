/*
 * @Description: menu modal
 * @Author: mus
 * @Date: 2019-09-19 17:03:33
 * @LastEditTime: 2019-12-03 16:17:04
 * @LastEditors: dailinbo
 * @Email: mus@szkingdom.com
 */
import Service from '@/utils/Service';

const { getNewUserGroup } = Service;

export default {
  namespace: 'userGroup',
  state: {
    saveUser: {},
  },
  effects: {
    *newUserGroup({ payload, callback }, { call, put }) {
      const response = yield call(getNewUserGroup, { param: payload });
      if (response.bcjson.flag === '1' || !response.bcjson.flag) {
        yield put({
          type: 'save',
          payload: response.bcjson.items,
        });
        callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        saveUser: action.payload,
      };
    },
  },
};
