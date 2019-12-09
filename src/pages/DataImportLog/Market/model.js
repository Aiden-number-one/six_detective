/*
 * @Des: data import log comp
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors: iron
 * @LastEditTime: 2019-12-06 17:07:40
 */

import fetch from '@/utils/request.default';

export default {
  namespace: 'market',
  state: {
    logs: [],
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
      const items = yield call(fetch('logs'), params);
      yield put({
        type: 'save',
        payload: items,
      });
    },
  },
};
