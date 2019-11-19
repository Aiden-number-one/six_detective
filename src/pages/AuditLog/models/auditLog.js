import Service from '@/utils/Service';

const { getAuditLog } = Service;

const getAuditLogModel = {
  namespace: 'auditLog',
  state: {
    data: [],
  },
  effects: {
    *getAuditLogList({ payload }, { call, put }) {
      const response = yield call(getAuditLog, { param: payload });
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

export default getAuditLogModel;
