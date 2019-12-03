/*
 * @Description: menu modal
 * @Author: mus
 * @Date: 2019-09-19 17:03:33
 * @LastEditTime: 2019-12-03 20:13:10
 * @LastEditors: dailinbo
 * @Email: mus@szkingdom.com
 */
import Service from '@/utils/Service';

const { addUser, getMenuUserGroup } = Service;

export default {
  namespace: 'newUser',
  state: {
    saveUser: {},
    data: [],
  },
  effects: {
    *newUser({ payload, callback }, { call, put }) {
      const response = yield call(addUser, { param: payload });
      if (response.bcjson.flag === '1' || !response.bcjson.flag) {
        yield put({
          type: 'save',
          payload: response.bcjson.items,
        });
        callback();
      }
    },
    *getMenuUserGroup({ payload }, { call, put }) {
      const response = yield call(getMenuUserGroup, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
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
    getDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
