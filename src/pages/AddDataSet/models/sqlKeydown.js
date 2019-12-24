/*
 * @Author: Sean Mu
 * @Date: 2019-04-25 20:10:10
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-06-21 15:26:59
 */
import Service from '@/utils/Service';

const { sqlFormated, getQryStatement } = Service;

export default {
  namespace: 'sqlKeydown',

  state: {
    sql: '',
    visible: false,
    sqlItem: {},
  },

  effects: {
    // sql美化
    *sqlFormated({ payload }, { call, put }) {
      const res = yield call(sqlFormated, { param: payload });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'changeSql',
          payload: res.bcjson.items[0].formatedContent,
        });
      }
    },
    // 获取sql语句
    *querySql({ payload, callback }, { call }) {
      // const sql = yield select(({ sqlKeydown }) => sqlKeydown.sql);
      const data = yield call(getQryStatement, { param: payload });
      if (data && data.bcjson.flag === '1') {
        callback(data.bcjson.items[0].qryStatement);
        // yield put({
        //   type: 'changeSql',
        //   payload: sql + data.bcjson.items[0].qryStatement,
        // });
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
    clear() {
      return {
        sql: '',
        visible: false,
        sqlItem: {},
      };
    },
  },
};
