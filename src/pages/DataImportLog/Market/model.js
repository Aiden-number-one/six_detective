/*
 * @Des: market import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2019-12-24 20:47:33
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';

export async function getLogs(params = {}) {
  const { page = 1, pageSize = 10, ...rest } = params;
  return request('get_md_proc_progress', {
    data: {
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      ...rest,
    },
  });
}

export async function postManual(params) {
  return request('set_imp_his_add', { data: params });
}

export async function postAuto(params) {
  return request('set_market_task_execute', { data: params });
}

export const pageSelector = ({ lop }) => lop.page;

export default {
  namespace: 'market',
  state: {
    logs: [],
    total: 0,
  },
  reducers: {
    save(state, { payload }) {
      const { logs, total } = payload;
      return {
        ...state,
        logs,
        total,
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { items, totalCount, err } = yield call(getLogs, payload);

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'save',
        payload: {
          logs: items,
          total: totalCount,
        },
      });
    },
    *importByManual({ payload }, { call, put }) {
      const { err } = yield call(postManual, payload);
      if (err) {
        throw new Error(err);
      }
      message.success('upload success');
      yield put({ type: 'reload', payload });
    },
    *importByAuto({ payload }, { call, put }) {
      const { err } = yield call(postAuto, payload);
      if (err) {
        throw new Error(err);
      }
      message.success('execute success');
      yield put({ type: 'reload', payload });
    },
    *reload({ payload }, { put }) {
      yield put({ type: 'fetch', payload });
    },
  },
};
