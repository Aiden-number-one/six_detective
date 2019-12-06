/*
 * @Des: data import log comp
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors: iron
 * @LastEditTime: 2019-12-05 19:40:27
 */

import { request } from '@/utils/request.default';

export async function getLogs(params) {
  return request('loplogs', { data: params });
}

export async function postManual(params) {
  return request('manual-import', { data: params });
}

export async function postAuto(params) {
  return request('auto-import', { data: params });
}

export const pageSelector = ({ lop }) => lop.page;

export default {
  namespace: 'lop',
  state: {
    logs: [],
    total: null,
    page: null,
  },
  reducers: {
    save(
      state,
      {
        payload: { logs },
      },
    ) {
      return {
        ...state,
        logs,
      };
    },
  },
  effects: {
    *fetch({ params: { page = 1 } = {} }, { call, put }) {
      const { items, msg } = yield call(getLogs, { page });

      if (!msg) {
        yield put({
          type: 'save',
          payload: {
            logs: items,
          },
        });
      } else {
        throw new Error(msg);
      }
    },
    *importByManual({ params }, { call, put }) {
      yield call(postManual, params);
      yield put({ type: 'reload' });
    },
    *importByAuto({ params }, { call, put }) {
      yield call(postAuto, params);
      yield put({ type: 'reload' });
    },
    *reload(action, { put, select }) {
      const page = yield select(pageSelector);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
};
