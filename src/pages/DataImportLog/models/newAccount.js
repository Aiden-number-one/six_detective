/*
 * @Des: market import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-11 11:19:03
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
    ...rest
  } = params;
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
export async function getParseFiles(files) {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('multifiles', file);
  });

  return request('multi_file_parser', {
    data: formData,
  });
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
    *fetch({ payload = {} }, { call, put, select }) {
      const { page, pageSize: ps, ...rest } = payload;

      const pageSize = yield select(({ newAccount }) => ps || newAccount.pageSize);

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
    *fetchParseFiles({ payload }, { call, put }) {
      const { err, items } = yield call(getParseFiles, payload);
      if (err) {
        throw new Error(err);
      }
      return items;
    },
    *importByManual({ payload }, { call }) {
      const { file, market, submitterCode, category } = payload;
      const { err: uploadErr, items } = yield call(fileUpload, { file });

      if (uploadErr) {
        message.warn(uploadErr);
        return uploadErr;
      }

      const { err: manualErr } = yield call(postManual, {
        filename: items.relativeUrl,
        market,
        category,
        submitterCode,
      });

      if (manualErr) {
        message.warn(manualErr);
        return manualErr;
      }
      return '';
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
