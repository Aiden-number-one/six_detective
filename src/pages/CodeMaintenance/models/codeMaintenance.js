import Service from '@/utils/Service';

const { codeList } = Service;
const getCodeListModel = {
  namespace: 'codeList',
  state: {
    data: [],
  },
  effects: {
    *getCodeList({ payload }, { call, put }) {
      const response = yield call(codeList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson.items,
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

export default getCodeListModel;
