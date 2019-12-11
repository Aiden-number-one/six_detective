import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getModelList,
  getModelImage,
  createModel,
  deleteModel,
  importModel,
  exportModel,
  deployModel,
} = Service;
export default {
  namespace: 'approvalDesign',
  state: {
    data: [],
    modelImage: '',
    chooseModelId: '',
  },

  effects: {
    *modelListDatas({ payload, callback, callback2 }, { call, put }) {
      const response = yield call(getModelList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson.items,
          });
          callback(
            response.bcjson.items && response.bcjson.items[0] && response.bcjson.items[0].id,
          );
          if (callback2) {
            callback2();
          }
        }
      }
    },
    *modelImageDatas({ payload }, { call, put }) {
      const response = yield call(getModelImage, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setImageDatas',
            payload: response.bcjson.items,
          });
        }
      } else {
        yield put({
          type: 'setImageDatas',
          payload: '',
        });
      }
    },
    *createModel({ payload, callback }, { call }) {
      const response = yield call(createModel, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('New success');
        callback('1', '10');
      } else {
        message.error('New failure');
      }
    },
    *deleteModel({ payload, callback }, { call }) {
      const response = yield call(deleteModel, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('Delete successful');
        callback('1', '10');
      } else {
        message.error('Delete failed');
      }
    },
    *importModel({ payload, callback }, { call }) {
      const response = yield call(importModel, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('Successful import');
        callback('1', '10');
      } else {
        message.error('Import failed');
      }
    },
    *exportModel({ payload, callback }, { call }) {
      const response = yield call(exportModel, { param: payload });
      if (response.bcjson.flag === '1') {
        callback(response.bcjson.items);
      } else {
        message.error('Export failure');
      }
    },
    *deployModel({ payload }, { call }) {
      const response = yield call(deployModel, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('Deployment success');
      } else {
        message.error('Deployment failure');
      }
    },
  },

  reducers: {
    setDatas(state, action) {
      return {
        ...state,
        data: action.payload,
        chooseModelId: action.payload && action.payload[0] && action.payload[0].id,
      };
    },
    changeModelId(state, action) {
      return {
        ...state,
        chooseModelId: action.payload.chooseModelId,
      };
    },
    setImageDatas(state, action) {
      return {
        ...state,
        modelImage: action.payload,
      };
    },
  },
};
