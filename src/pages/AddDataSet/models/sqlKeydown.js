/*
 * @Author: Sean Mu
 * @Date: 2019-04-25 20:10:10
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-06-21 15:26:59
 */
import Service from '@/utils/Service';

const { getMetadataTablePerform, getSqlParserInfo } = Service;

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
      if (res && res.kdjson.flag === '1') {
        yield put({
          type: 'changeSql',
          payload: res.kdjson.items[0].formatedSql,
        });
      }
    },
    *getMetadataTablePerform({ payload }, { call, put }) {
      // const sql = yield select(({ sqlKeydown }) => sqlKeydown.sql);
      const data = yield call(getMetadataTablePerform, { param: payload });
      if (data && data.kdjson.flag === '1') {
        yield put({
          type: 'changeSql',
          payload: data.kdjson.items[0].viewSql,
        });
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
