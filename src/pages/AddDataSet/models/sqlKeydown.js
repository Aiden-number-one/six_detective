/*
 * @Author: Sean Mu
 * @Date: 2019-04-25 20:10:10
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-06-21 15:26:59
 */
import Service from '@/utils/Service';

const { getMetadataTablePerform, getSqlParserInfo, getQryStatement } = Service;

export default {
  namespace: 'sqlKeydown',

  state: {
    sql: '',
    visible: false,
    sqlItem: {},
  },

  effects: {
    // sql美化
    *formatedSql({ payload }, { call, put }) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { connection_id, ...param } = payload;
      const res = yield call(getSqlParserInfo, { param });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'changeSql',
          payload: res.bcjson.items[0].formatedSql,
        });
      }
    },
    *getMetadataTablePerform({ payload }, { call, put }) {
      // const sql = yield select(({ sqlKeydown }) => sqlKeydown.sql);
      const data = yield call(getMetadataTablePerform, { param: payload });
      if (data && data.bcjson.flag === '1') {
        yield put({
          type: 'changeSql',
          payload: data.bcjson.items[0].viewSql,
        });
      }
    },
    // 获取sql语句
    *querySql({ payload }, { call, put, select }) {
      const sql = yield select(({ sqlKeydown }) => sqlKeydown.sql);
      const data = yield call(getQryStatement, { param: payload });
      if (data && data.bcjson.flag === '1') {
        yield put({
          type: 'changeSql',
          payload: sql + data.bcjson.items[0].qryStatement,
        });
        // yield put({
        //   type: 'sqlDataSource/clearMetadata',
        // })
      }
    },
  },

  reducers: {
    changeSql(state, action) {
      return {
        ...state,
        sql: action.payload,
      };
    },
    changeSqlDropDown(state, action) {
      return {
        ...state,
        visible: action.payload,
      };
    },
    changeSqlItem(state, action) {
      return {
        ...state,
        sqlItem: action.payload,
      };
    },
  },
};
