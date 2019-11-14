/*
 * @Description: 获取数据源列表
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime: 2019-11-14 13:25:40
 * @LastEditors: lan
 */
import Service from '@/utils/Service';

const { getDataSourceList } = Service;

export default {
  namespace: 'dataSource',
  state: {
    activeData: {},
    dataSourceList: [],
    activeCID: '',
  },
  effects: {
    *getDataSourceList({ payload, callback }, { call, put }) {
      const response = yield call(getDataSourceList, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setDataSourceList',
          payload: response.bcjson.items,
        });
        if (response.bcjson.items[0]) {
          yield put({
            type: 'setActiveCID',
            payload: response.bcjson.items[0].connectionId,
          });
          if (callback) callback(response);
        }
      }
    },
  },
  reducers: {
    saveDate(state, action) {
      return {
        ...state,
        activeData: action.payload,
      };
    },
    setDataSourceList(state, action) {
      return {
        ...state,
        dataSourceList: action.payload,
      };
    },
    setActiveCID(state, action) {
      return {
        ...state,
        activeCID: action.payload,
      };
    },
  },
};
