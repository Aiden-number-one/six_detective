/*
 * @Des: market import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-03 09:54:56
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

export async function postAuto() {
  return request('set_manual_start_new_acc_job');
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
      const { file, market, submitterCode } = payload;
      const { err: uploadErr, items } = yield call(fileUpload, { file });

      const { err: manualErr } = yield call(postManual, {
        filename: items.relativeUrl,
        market,
        submitterCode,
      });

      const err = manualErr || uploadErr;
      if (err) {
        throw new Error(err);
      }
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
