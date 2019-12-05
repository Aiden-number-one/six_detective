/*
 * @Description:
 * @Author: dailinbo
 * @Date: 2019-11-01 11:02:37
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-05 09:52:55
 */
import Service from '@/utils/Service';

const { getMenuUserGroup, getNewUserGroup } = Service;

const menuUserGroup = {
  namespace: 'menuUserGroup',
  state: {
    data: [],
    saveUser: {},
  },
  effects: {
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
    getDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        saveUser: action.payload,
      };
    },
  },
};

export default menuUserGroup;
