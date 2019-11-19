/*
 * @Description: 获取数据源表格
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime: 2019-11-19 13:38:26
 * @LastEditors: lan
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getTableData,
  delTableData,
  getMetaData,
  addMetaData,
  getSchemas,
  getColumnInfo,
  getMetadataPerform,
  updMetadata,
  updRecordCount,
  exportInfo,
  getToken,
} = Service;

export default {
  namespace: 'tableData',
  state: {
    schemasNames: [],
    tableData: [],
    activeTableData: {},
    metaData: [],
    columnData: [],
    metadataPerform: [],
  },
  effects: {
    *getSchemas({ payload }, { call, put }) {
      const response = yield call(getSchemas, { param: payload });
      yield put({
        type: 'setSchemas',
        payload: response.bcjson.items,
      });
    },
    *getTableData({ payload }, { call, put }) {
      const response = yield call(getTableData, { param: payload });
      yield put({
        type: 'setTableData',
        payload: response.bcjson.items,
      });
    },
    *delTableData({ payload, callback }, { call }) {
      const response = yield call(delTableData, { param: payload });
      if (response.bcjson.flag) {
        if (callback) callback();
      }
    },
    *getMetaData({ payload }, { call, put }) {
      const response = yield call(getMetaData, { param: payload });
      yield put({
        type: 'setMetaData',
        payload: response.bcjson.items,
      });
    },
    *addMetaData({ payload, callback }, { call }) {
      const response = yield call(addMetaData, { param: payload });
      if (response.bcjson.flag === '1') {
        callback();
      }
    },
    *updMetadata({ payload, callback }, { call }) {
      const response = yield call(updMetadata, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('updata success');
        callback();
      }
    },
    *updRecordCount({ payload, callback }, { call }) {
      const response = yield call(updRecordCount, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('updata success');
        callback();
      }
    },
    *exportInfo({ payload, callback }, { call }) {
      const response = yield call(exportInfo, { param: payload });
      if (response.bcjson.flag === '1') {
        // message.success('updata success');
        callback(response);
      }
    },
    *getToken({ payload, callback }, { call }) {
      const response = yield call(getToken, { param: payload });
      if (response.bcjson.flag === '1') {
        // message.success('updata success');
        callback(response);
      }
    },
    *getColumnInfo({ payload }, { call, put }) {
      const response = yield call(getColumnInfo, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setColumnData',
          payload: response.bcjson.items,
        })
      }
    },
    *getMetadataPerform({ payload }, { call, put }) {
      const response = yield call(getMetadataPerform, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setMetadataPerform',
          payload: response.bcjson.items,
        })
      }
    },
  },
  reducers: {
    setSchemas(state, action) {
      return {
        ...state,
        schemasNames: action.payload,
      };
    },
    setTableData(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    setActiveTableData(state, action) {
      return {
        ...state,
        activeTableData: action.payload,
      }
    },
    setMetaData(state, action) {
      return {
        ...state,
        metaData: action.payload,
      };
    },
    clearMetaData(state) {
      return {
        ...state,
        metaData: [],
      };
    },
    setColumnData(state, action) {
      return {
        ...state,
        columnData: action.payload,
      };
    },
    setMetadataPerform(state, action) {
      return {
        ...state,
        metadataPerform: action.payload,
      };
    },
  },
};
