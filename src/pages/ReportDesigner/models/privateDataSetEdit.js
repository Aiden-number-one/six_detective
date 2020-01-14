/*
 * @Des: 编辑数据集的相关modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-13 20:40:05
 */

import Service from '@/utils/Service';

const {
  sqlFormated, // sql美化
  getVariableList, // 获取参数
  getFieldList, // 获取列表
  getMetadataTablePerform, // 数据预览
} = Service;

export default {
  namespace: 'privateDataSetEdit',
  state: {
    sql: '',
    variableList: [],
    column: [],
    tableData: [],
  },
  effects: {
    // 获取表数据
    *getMetadataTablePerform({ payload }, { call, put }) {
      const res = yield call(getMetadataTablePerform, { param: payload });
      if (res && res.bcjson.flag === '1') {
        const tableHead = res.bcjson.items[0] ? res.bcjson.items[0] : {};
        const column = Object.keys(tableHead).map(value => ({
          value,
          // eslint-disable-next-line no-restricted-globals
          type: isNaN(tableHead[value]) ? 'dimension' : 'measure',
        }));
        // 处理数据生成表头
        yield put({
          type: 'changeColumn',
          payload: column,
        });
        yield put({
          type: 'addMetadataTablePerform',
          payload: res.bcjson.items,
        });
      } else {
        yield put({
          type: 'addMetadataTablePerform',
          payload: [],
        });
      }
    },
    *sqlFormated({ payload }, { call, put }) {
      const res = yield call(sqlFormated, { param: payload });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'changeSql',
          payload: res.bcjson.items[0].formatedContent,
        });
      }
    },
    // 获取参数
    *getVariable({ payload }, { call, put }) {
      const res = yield call(getVariableList, { param: payload });
      if (res && res.bcjson.flag === '1') {
        // 参数列表
        yield put({
          type: 'setVariableList',
          payload: res.bcjson.items,
        });
      }
    },
    // 获取字段
    *getField({ payload }, { call }) {
      const res = yield call(getFieldList, { param: payload });
      if (res && res.bcjson.flag === '1') {
        return res.bcjson.items;
      }
      return res.bcjson.msg;
    },
  },
  reducers: {
    // 保存数据预览表格表头
    changeColumn(state, action) {
      return {
        ...state,
        column: action.payload,
      };
    },
    // 保存数据预览表格数据
    addMetadataTablePerform(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    clear() {
      return {
        sql: '',
        variableList: [],
      };
    },
    changeSql(state, action) {
      return {
        ...state,
        sql: action.payload,
      };
    },
    setVariableList(state, action) {
      return {
        ...state,
        variableList: action.payload,
      };
    },
  },
};
