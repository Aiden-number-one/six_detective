/*
 * @Description: This is for EmailListModel asynchronization request function.
 * @Author: dailinbo
 * @Date: 2019-11-05 14:04:16
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-13 14:19:48
 */
import { notification } from 'antd';
import Service from '@/utils/Service';

const { emailList, addEmail, deleteEmail, updateEmail } = Service;
const emailParameter = {
  namespace: 'getEmail',
  state: {
    data: [],
    datas: {},
    deleteDatas: {},
    modifyData: {},
  },
  effects: {
    *getEmailList({ payload, callback }, { call, put }) {
      const response = yield call(emailList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
          callback();
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
    *updateEmail({ payload, callback }, { call, put }) {
      const response = yield call(updateEmail, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson.items,
          });
          callback();
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
    *addEmailDate({ payload, callback }, { call, put }) {
      const response = yield call(addEmail, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'addDatas',
            payload: response.bcjson.items,
          });
          callback();
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
    *deleteEmailDate({ payload, callback }, { call, put }) {
      const response = yield call(deleteEmail, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'deleteDatas',
            payload: response.bcjson.items,
          });
        }
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
    setDatas(state, action) {
      return {
        ...state,
        modifyData: action.payload,
      };
    },
    addDatas(state, action) {
      return {
        ...state,
        datas: action.payload,
      };
    },
    deleteDatas(state, action) {
      return {
        ...state,
        datas: action.payload,
      };
    },
  },
};

export default emailParameter;
