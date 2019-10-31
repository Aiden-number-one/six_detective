import Service from '@/utils/Service';

const { getConfig, addConfig, deleteConfig, saveConfig } = Service;
const approvalSetModel = {
  namespace: 'approvalSet',
  state: {
    data: [],
  },
  effects: {
    *approvalConfigDatas({ payload }, { call, put }) {
      const response = yield call(getConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *addConfigDatas({ payload, callback }, { call }) {
      const response = yield call(addConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        callback({
          pageNumber: '1',
          pageSize: '10',
        });
        // if (response.bcjson.items) {
        //   yield put({
        //     type: 'setDatas',
        //     payload: response.bcjson.items,
        //   });
        // }
      }
    },
    *deleteConfigDatas({ payload, callback }, { call }) {
      const response = yield call(deleteConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        callback({
          pageNumber: '1',
          pageSize: '10',
        });
        // if (response.bcjson.items) {
        //   yield put({
        //     type: 'setDatas',
        //     payload: response.bcjson.items,
        //   });
        // }
      }
    },
    *saveConfigDatas({ payload, callback }, { call }) {
      const response = yield call(saveConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        callback({
          pageNumber: '1',
          pageSize: '10',
        });
      }
    },
  },
  reducers: {
    setDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
export default approvalSetModel;
