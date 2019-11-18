/*
 * @Description: This is for EmailListModel asynchronization request function.
 * @Author: dailinbo
 * @Date: 2019-11-05 14:04:16
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-11-15 14:54:59
 */
import Service from '@/utils/Service';

const { emailList, addEmail, deleteEmail } = Service;
const getEmailListModel = {
  namespace: 'getEmail',
  state: {
    data: [],
    datas: {},
    deleteDatas: {},
  },
  effects: {
    *getEmailList({ payload }, { call, put }) {
      const response = yield call(emailList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
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

export default getEmailListModel;
