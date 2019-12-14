/*
 * @Description:
 * @Author: dailinbo
 * @Date: 2019-11-01 11:02:37
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-13 14:15:30
 */
import { notification } from 'antd';
import Service from '@/utils/Service';

const { getMenuUserGroup, getNewUserGroup, getModifyUserGroup } = Service;

const menuUserGroup = {
  namespace: 'menuUserGroup',
  state: {
    data: [],
    saveUser: {},
    updateData: {},
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
    *newUserGroup({ payload, callback }, { call, put }) {
      const response = yield call(getNewUserGroup, { param: payload });
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
    *updateUserGroup({ payload, callback }, { call, put }) {
      const response = yield call(getModifyUserGroup, { param: payload });
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

export default menuUserGroup;
