/*
 * @Des: market import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-11 12:31:35
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';
import { reqFormat as format, defaultPage, defaultPageSize } from '../constants';

export async function getLogs(params = {}) {
  const {
    page = defaultPage,
    pageSize = defaultPageSize,
    market,
    startDate,
    endDate,
    fileType,
  } = params;
  return request('get_md_proc_progress', {
    data: {
      fileType,
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      market: market && market.toString(),
      tradeDateSt: startDate && startDate.format(format),
      tradeDateEt: endDate && endDate.format(format),
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
    page: defaultPage,
    pageSize: defaultPageSize,
    total: 0,
  },
  reducers: {
    save(state, { payload }) {
      const { logs, page, pageSize, total } = payload;
      return {
        ...state,
        logs,
        page,
        pageSize,
        total,
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { page, pageSize: ps, ...rest } = payload;

      const pageSize = yield select(({ market }) => ps || market.pageSize);

      const { items, totalCount, err } = yield call(getLogs, {
        page,
        pageSize,
        ...rest,
      });

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'save',
        payload: {
          logs: items,
          page,
          pageSize,
          total: totalCount,
        },
      });
    },
    *importByManual({ payload }, { call, put }) {
      const { searchParams, ...rest } = payload;
      const { err, msg } = yield call(postManual, rest);
      if (err) {
        throw new Error(err);
      }
      message.success(msg);
      yield put({ type: 'fetch', payload: searchParams });
    },
    *importByAuto({ payload }, { call, put }) {
      const { err, msg } = yield call(postAuto);
      if (err) {
        throw new Error(err);
      }
      message.success(msg);
      yield put({ type: 'fetch', payload });
    },
  },
};
