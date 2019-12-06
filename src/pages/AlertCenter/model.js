/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors: iron
 * @LastEditTime: 2019-12-05 14:42:04
 */
import { request } from '@/utils/request.default';

// just for unit test
// `fetch` high order function return anonymous func
export async function getAlerts(params) {
  return request('alerts', { data: params });
}

export default {
  namespace: 'alertCenter',
  state: {
    alerts: [],
  },
  reducers: {
    save(state, { payload: alerts }) {
      return {
        ...state,
        alerts,
      };
    },
  },
  effects: {
    *fetch({ params }, { call, put }) {
      const { items, msg } = yield call(getAlerts, params);
      if (!msg) {
        yield put({
          type: 'save',
          payload: items,
        });
      } else {
        throw new Error(msg);
      }
    },
  },
};
