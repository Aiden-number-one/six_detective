/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors: iron
 * @LastEditTime: 2019-12-04 16:59:38
 */
import { request } from '@/utils/request.default';

// just for unit test
// `fetch` high order function return anonymous func
export async function requestAlerts(params = {}) {
  return request('alerts', { data: params });
}

export default {
  namespace: 'alertCenter',
  state: {
    alerts: [],
  },
  reducers: {
    saveAlerts(state, { payload: alerts }) {
      return {
        ...state,
        alerts,
      };
    },
  },
  effects: {
    *fetchAlerts({ params }, { call, put }) {
      const { items } = yield call(requestAlerts, params);
      yield put({
        type: 'saveAlerts',
        payload: items,
      });
    },
  },
};
