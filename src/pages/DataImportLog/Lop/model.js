/*
 * @Des: data import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2019-12-27 19:37:05
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';
import { reqFormat as format } from '../constants';

export async function getLogs(params = {}) {
  const { page = 1, pageSize = 10, startDate, endDate, ...rest } = params;
  return request('get_lop_proc_progress_list_page', {
    data: {
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      startTradeDate: startDate && startDate.format(format),
      endTradeDate: endDate && endDate.format(format),
      ...rest,
    },
  });
}

export async function postManual(params) {
  return request('set_lop_report_manual_import', { data: params });
}

export async function postAuto() {
  return request('set_lop_report_auto_import');
}

export async function getReportUrl({ lopImpId }) {
  return request('set_lop_report_download', {
    data: {
      lopImpId: lopImpId.toString(),
    },
  });
}

export const pageSelector = ({ lop }) => lop.page;

export default {
  namespace: 'lop',
  state: {
    logs: [],
    page: 1,
    total: 0,
  },
  reducers: {
    save(state, { payload }) {
      const { logs, page = 1, total } = payload;
      return {
        ...state,
        page,
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
          page: payload.page,
          total: totalCount,
        },
      });
    },
    *importByManual({ payload }, { call }) {
      const { err, msg } = yield call(postManual, payload);
      if (err) {
        throw new Error(err);
      }
      message.success(msg);
    },
    *importByAuto({ payload }, { call, put }) {
      const { err, msg } = yield call(postAuto);
      if (err) {
        throw new Error(err);
      }
      message.success(msg);
      yield put({ type: 'fetch', payload });
    },
    *fetchReportUrl({ payload }, { call, put }) {
      const { err, items: reportUrl } = yield call(getReportUrl, payload);
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'saveReportUrl',
        payload: {
          reportUrl,
        },
      });

      return reportUrl;
    },
  },
};
