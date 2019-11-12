import Service from '@/utils/Service';

const { getApproval } = Service;
const approvalCheckModel = {
  namespace: 'approvalCheck',
  state: {
    data: {},
  },
  effects: {
    *approvalCheckDatas({ payload }, { call, put }) {
      const response = yield call(getApproval, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson,
          });
        }
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
export default approvalCheckModel;
