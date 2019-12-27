/*
 * @Des: market import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2019-12-27 19:48:27
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';
import { reqFormat as format } from '../constants';

export async function getLogs(params = {}) {
  const { page = 1, pageSize = 10, market, startDate, endDate, ...rest } = params;
  return request('get_new_acc_lop_proc_progress', {
    data: {
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      market: market && market.toString(),
      startTradeDate: startDate && startDate.format(format),
      endTradeDate: endDate && endDate.format(format),
      ...rest,
    },
  });
}

export async function postManual(params) {
  return request('set_imp_his_add', { data: params });
}

export const pageSelector = ({ newAccount }) => newAccount.page;

export default {
  namespace: 'newAccount',
  state: {
    logs: [],
    total: 0,
  },
  reducers: {
    save(state, { payload }) {
      const { logs, page = 1, total } = payload;
      return {
        ...state,
        logs,
        page,
        total,
      };
    },
  },
  effects: {
    *fetch({ payload = {} }, { call, put }) {
      const { items, totalCount, err } = yield call(getLogs, payload);

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'save',
        payload: {
          logs: items,
          page: payload.page,
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
      yield put({ type: 'fetch', payload });
    },
  },
};
