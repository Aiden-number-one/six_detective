/*
 * @Description: This is AuditLog
 * @Author: dailinbo
 * @Date: 2019-11-01 10:40:21
 * @LastEditors  : dailinbo
 * @LastEditTime : 2019-12-24 20:18:41
 */
import Service from '@/utils/Service';

const { getAuditLog, dataExport } = Service;

const getAuditLogModel = {
  namespace: 'auditLog',
  state: {
    data: [],
    dataExport: [],
  },
  effects: {
    *getAuditLogList({ payload, callback }, { call, put }) {
      const response = yield call(getAuditLog, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
          callback();
        }
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *getDataExport({ payload }, { call, put }) {
      const response = yield call(dataExport, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDataExport',
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
    getDataExport(state, action) {
      return {
        ...state,
        dataExport: action.payload,
      };
    },
  },
};

export default getAuditLogModel;
