import Service from '@/utils/Service';

const { systemParamsList, systemParamsUpdate } = Service;
const getSystemParamsListModel = {
  namespace: 'systemParams',
  state: {
    data: [],
    obj: {},
  },
  effects: {
    *getSystemParamsList({ payload }, { call, put }) {
      const response = yield call(systemParamsList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *systemParamsUpdate({ payload, callback }, { call, put }) {
      const response = yield call(systemParamsUpdate, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'updateDatas',
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
    updateDatas(state, action) {
      return {
        ...state,
        obj: action.payload,
      };
    },
  },
};

export default getSystemParamsListModel;
