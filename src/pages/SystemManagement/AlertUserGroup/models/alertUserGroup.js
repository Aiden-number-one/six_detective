/*
 * @Description:
 * @Author: dailinbo
 * @Date: 2019-11-01 11:02:37
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-06 15:35:55
 */
import Service from '@/utils/Service';

const { getAlertUserGroup, newAlertUser, updateAlertUser, getAlertUserList } = Service;

const alertUserGroup = {
  namespace: 'alertUserGroup',
  state: {
    data: [],
    saveUser: {},
    updateData: {},
    getAlertData: [],
  },
  effects: {
    *getAlertUserGroup({ payload }, { call, put }) {
      const response = yield call(getAlertUserGroup, { param: payload });
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
    *newAlertUser({ payload, callback }, { call, put }) {
      const response = yield call(newAlertUser, { param: payload });
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
    *updateUserAlert({ payload, callback }, { call, put }) {
      const response = yield call(updateAlertUser, { param: payload });
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
    *getAlertUserList({ payload }, { call, put }) {
      const response = yield call(getAlertUserList, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'getAlert',
          payload: response.bcjson.items,
        });
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
    getAlert(state, action) {
      return {
        ...state,
        getAlertData: action.payload,
      };
    },
  },
};

export default alertUserGroup;
