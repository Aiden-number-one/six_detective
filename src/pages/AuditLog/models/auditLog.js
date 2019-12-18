/*
 * @Description: This is AuditLog
 * @Author: dailinbo
 * @Date: 2019-11-01 10:40:21
 * @LastEditors  : dailinbo
 * @LastEditTime : 2019-12-18 09:45:02
 */
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
      } else {
        throw new Error(response.bcjson.msg);
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
