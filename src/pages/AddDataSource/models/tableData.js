/*
 * @Description: 获取数据源表格
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime: 2019-11-19 14:28:28
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
    // 获取用户信息
    *getSchemas({ payload }, { call, put }) {
      const response = yield call(getSchemas, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setSchemas',
          payload: response.bcjson.items,
        });
      }
    },
    // 获取表格信息
    *getTableData({ payload }, { call, put }) {
      const response = yield call(getTableData, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setTableData',
          payload: response.bcjson.items,
        });
      }
    },
    // 删除表格数据
    *delTableData({ payload, callback }, { call }) {
      const response = yield call(delTableData, { param: payload });
      if (response.bcjson.flag === '1') {
        if (callback) callback();
      }
    },
    // 获取元数据
    *getMetaData({ payload }, { call, put }) {
      const response = yield call(getMetaData, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setMetaData',
          payload: response.bcjson.items,
        });
      }
    },
    // 添加元数据
    *addMetaData({ payload, callback }, { call }) {
      const response = yield call(addMetaData, { param: payload });
      if (response.bcjson.flag === '1') {
        callback();
      }
    },
    // 更新表格元数据
    *updMetadata({ payload, callback }, { call }) {
      const response = yield call(updMetadata, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('updata success');
        callback();
      }
    },
    // 更新行数
    *updRecordCount({ payload, callback }, { call }) {
      const response = yield call(updRecordCount, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('updata success');
        callback();
      }
    },
    // 导出
    *exportInfo({ payload, callback }, { call }) {
      const response = yield call(exportInfo, { param: payload });
      if (response.bcjson.flag === '1') {
        // message.success('updata success');
        callback(response);
      }
    },
    // 获取表列信息
    *getColumnInfo({ payload }, { call, put }) {
      const response = yield call(getColumnInfo, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setColumnData',
          payload: response.bcjson.items,
        })
      }
    },
    // 预览数据
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
