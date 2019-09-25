/*
 * @Description: lan
 * @Author: lan
 * @Date: 2019-08-08 15:22:20
 * @LastEditTime: 2019-09-25 15:32:01
 * @LastEditors: lan
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const { getDatas, delDatas, getDataSourceList } = Service;
export default {
  namespace: 'api',

  state: {
    data: [],
    dataSourceList: [],
  },

  effects: {
    *queryDatas({ payload }, { call, put }) {
      const response = yield call(getDatas, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.kdjson.items,
          });
        }
      }
    },
    *delDatas({ payload }, { call, put, select }) {
      const response = yield call(delDatas, payload);
      const data = yield select(state => state.api.data);
      data.shift();
      if (response.kdjson.flag === '1') {
        yield put({
          type: 'deleteDatas',
          payload: data,
        });
        message.success('删除成功');
      }
    },
    *queryDataSourceList({ payload }, { call, put }) {
      const response = yield call(getDataSourceList, payload);
      if (response.kdjson.flag === '1') {
        if (response.kdjson.items) {
          yield put({
            type: 'setDataSourceList',
            payload: response.kdjson.items,
          });
        }
      }
    },
    *changeActive({ payload }, { put, select }) {
      const dataSourceList = yield select(state => state.api.dataSourceList);
      dataSourceList.forEach(element => {
        const item = element;
        if (element.connectionId === payload) {
          item.active = true;
        } else {
          item.active = false;
        }
      });
      yield put({
        type: 'setDataSourceList',
        payload: dataSourceList,
      });
    },
  },

  reducers: {
    setDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    deleteDatas(state, action) {
      return {
        ...state,
        data: [...action.payload],
      };
    },
    setDataSourceList(state, action) {
      return {
        ...state,
        dataSourceList: action.payload,
      };
    },
  },
};
