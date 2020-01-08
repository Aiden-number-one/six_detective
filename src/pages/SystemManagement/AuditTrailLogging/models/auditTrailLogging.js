/*
 * @Description: This is AuditLog
 * @Author: dailinbo
 * @Date: 2019-11-01 10:40:21
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-08 22:13:50
 */
import Service from '@/utils/Service';

const { getAuditLog, dataExport } = Service;

const auditTrailLogging = {
  namespace: 'auditLog',
  state: {
    data: [],
    dataExportPath: '',
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
    *getDataExport({ payload, callback }, { call, put }) {
      const response = yield call(dataExport, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getExport',
            payload: response.bcjson.items,
          });
          callback();
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
    getExport(state, action) {
      return {
        ...state,
        dataExportPath: action.payload,
      };
    },
  },
};

export default auditTrailLogging;
