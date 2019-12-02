/*
 * @Des: data import log comp
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors: iron
 * @LastEditTime: 2019-12-02 14:21:02
 */

import fetch from '@/utils/request.default';

export default {
  namespace: 'lop',
  state: {
    logs: [],
  },
  reducers: {
    saveLogs(state, { payload: logs }) {
      return {
        ...state,
        logs,
      };
    },
  },
  effects: {
    *fetchLogs({ params }, { call, put }) {
      const items = yield call(fetch('logs'), params);
      yield put({
        type: 'saveLogs',
        payload: items,
      });
    },
  },
};
