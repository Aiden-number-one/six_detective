/*
 * @Description:
 * @Author: dailinbo
 * @Date: 2019-11-01 11:02:37
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-13 14:16:13
 */
import { notification } from 'antd';
import Service from '@/utils/Service';

const { getAlertUserGroup, newAlertUser, updateAlertUser } = Service;

const alertUserGroup = {
  namespace: 'alertUserGroup',
  state: {
    data: [],
    saveUser: {},
    updateData: {},
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
        notification.error({
          message: 'error!!!',
          description: response.bcjson.msg.toString(),
          style: {
            maxHeight: 135,
            overflow: 'auto',
          },
        });
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
        notification.error({
          message: 'error!!!',
          description: response.bcjson.msg.toString(),
          style: {
            maxHeight: 135,
            overflow: 'auto',
          },
        });
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
        notification.error({
          message: 'error!!!',
          description: response.bcjson.msg.toString(),
          style: {
            maxHeight: 135,
            overflow: 'auto',
          },
        });
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
  },
};

export default alertUserGroup;
