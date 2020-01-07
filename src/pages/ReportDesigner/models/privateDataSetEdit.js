/*
 * @Des: 编辑数据集的相关modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-07 11:19:10
 */

import Service from '@/utils/Service';

const {
  sqlFormated, // sql美化
  getVariableList, // 获取参数
  getFieldList, // 获取列表
} = Service;

export default {
  namespace: 'privateDataSetEdit',
  state: {
    sql: '',
    variableList: [],
  },
  effects: {
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
