/*
 * @Des: market import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2019-12-25 10:53:15
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';

const format = 'YYYYMMDD';

export async function getLogs(params = {}) {
  const { page = 1, pageSize = 10, market, tradeDateSt, tradeDateEt, fileType } = params;
  return request('get_md_proc_progress', {
    data: {
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      market: market && market.toString(),
      fileType,
      tradeDateSt: tradeDateSt && tradeDateSt.format(format),
      tradeDateEt: tradeDateEt && tradeDateEt.format(format),
    },
  });
}

export async function postManual(params) {
  return request('set_imp_his_add', { data: params });
}

export async function postAuto() {
  return request('set_market_task_execute');
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
    *importByManual({ payload }, { call }) {
      const { err } = yield call(postManual, payload);
      if (err) {
        throw new Error(err);
      }
      message.success('upload success');
    },
    *importByAuto({ payload }, { call, put }) {
      const { err } = yield call(postAuto);
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
