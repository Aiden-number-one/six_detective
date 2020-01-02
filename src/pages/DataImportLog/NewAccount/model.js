/*
 * @Des: market import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-02 19:44:49
 */
// import { message } from 'antd';
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
  return request('set_lop_report_manual_import', { data: params });
}

export async function fileUpload(params) {
  const formData = new FormData();
  formData.append('file', params.file);
  return request('file_upload', {
    params: { fileClass: 'ACCOUNT' },
    data: formData,
  });
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
    *importByManual({ payload }, { call }) {
      const { err } = yield call(postManual, payload);
      if (err) {
        throw new Error(err);
      }
      // message.success(msg);
      // yield put({ type: 'fetch', payload });
    },
    *fileUpload({ payload }, { call }) {
      console.log(payload);
      const { err } = yield call(fileUpload, payload);
      if (err) {
        throw new Error(err);
      }
    },
  },
};
