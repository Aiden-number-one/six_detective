/*
 * @Des: data import log comp
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors: iron
 * @LastEditTime: 2019-12-04 18:02:02
 */

import fetch from '@/utils/request.default';

export const pageSelector = ({ lop }) => lop.page;

export default {
  namespace: 'lop',
  state: {
    logs: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: logs }) {
      return {
        ...state,
        logs,
      };
    },
  },
  effects: {
    *fetch({ params }, { call, put }) {
      const { items } = yield call(fetch('loplogs'), params);
      yield put({
        type: 'save',
        payload: items,
      });
    },
    *importByManual({ params }, { call, put }) {
      yield call(fetch('manual-import'), params);
      yield put({ type: 'reload' });
    },
    *importByAuto({ params }, { call, put }) {
      yield call(fetch('auto-import'), params);
      yield put({ type: 'reload' });
    },
    *reload(action, { put, select }) {
      const page = yield select(pageSelector);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
};
