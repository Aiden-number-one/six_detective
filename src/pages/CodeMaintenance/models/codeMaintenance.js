import { notification } from 'antd';
import Service from '@/utils/Service';

const { getSystemCode, updateCodeItem, deleteCodeItem } = Service;
const codeMaintenance = {
  namespace: 'codeList',
  state: {
    data: [],
    itemData: [],
    obj: {},
    objUpdate: {},
    objDelete: {},
  },
  effects: {
    *getCodeList({ payload, callback }, { call, put }) {
      const response = yield call(getSystemCode, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
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
    *getCodeItemList({ payload }, { call, put }) {
      const response = yield call(getSystemCode, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getItemDatas',
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
    *addCodeItem({ payload, callback }, { call, put }) {
      const response = yield call(getSystemCode, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson,
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
    *updateCodeItem({ payload, callback }, { call, put }) {
      const response = yield call(updateCodeItem, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson) {
          yield put({
            type: 'updateDatas',
            payload: response.bcjson,
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
    *deleteCodeItem({ payload, callback }, { call, put }) {
      const response = yield call(deleteCodeItem, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson) {
          yield put({
            type: 'deleteDatas',
            payload: response.bcjson,
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
    getItemDatas(state, action) {
      return {
        ...state,
        itemData: action.payload,
      };
    },
    setDatas(state, action) {
      return {
        ...state,
        obj: action.payload,
      };
    },
    updateDatas(state, action) {
      return {
        ...state,
        objUpdate: action.payload,
      };
    },
    deleteDatas(state, action) {
      return {
        ...state,
        objDelete: action.payload,
      };
    },
  },
};

export default codeMaintenance;
