import Service from '@/utils/Service';

const { systemParamsList } = Service;
const taskSwitch = {
  namespace: 'systemParams',
  state: {
    data: [],
    obj: {},
    getParamsData: [],
  },
  effects: {
    *getSystemParamsList({ payload }, { call, put }) {
      const response = yield call(systemParamsList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
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
  },
};

export default taskSwitch;
