/*
 * @Description:
 * @Author: dailinbo
 * @Date: 2019-11-01 11:02:37
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-17 16:48:26
 */
import Service from '@/utils/Service';

const { getMenuUserGroup, getNewUserGroup, getModifyUserGroup, ignoreMenuList } = Service;

const menuUserGroup = {
  namespace: 'menuUserGroup',
  state: {
    data: [],
    saveUser: {},
    updateData: {},
    ignoreMenusData: {},
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
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *newUserGroup({ payload, callback }, { call, put }) {
      const response = yield call(getNewUserGroup, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'save',
          payload: response.bcjson.items,
        });
        callback();
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *updateUserGroup({ payload, callback }, { call, put }) {
      const response = yield call(getModifyUserGroup, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'update',
          payload: response.bcjson.items,
        });
        callback();
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *getIgnoreMenuList({ payload, callback }, { call, put }) {
      const response = yield call(ignoreMenuList, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'getIgnore',
          payload: response.bcjson.items,
        });
        callback();
      } else {
        throw new Error(response.bcjson.msg);
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
    update(state, action) {
      return {
        ...state,
        updateData: action.payload,
      };
    },
    getIgnore(state, action) {
      return {
        ...state,
        ignoreMenusData: action.payload,
      };
    },
  },
};

export default menuUserGroup;
