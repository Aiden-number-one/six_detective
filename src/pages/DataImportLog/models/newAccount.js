/*
 * @Des: market import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-10 20:26:12
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
    total: 0,
    // parseFiles: [],
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
    // saveParseFiles(state, { payload }) {
    //   return {
    //     ...state,
    //     parseFiles: payload.parseFiles,
    //   };
    // },
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
    *fetchParseFiles({ payload }, { call, put }) {
      const { err, items } = yield call(getParseFiles, payload);
      if (err) {
        throw new Error(err);
      }
      return items;
      // yield put({
      //   type: 'saveParseFiles',
      //   payload: {
      //     parseFiles: items,
      //   },
      // });
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
