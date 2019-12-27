/*
 * @Des: data import log model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-30 09:44:56
 * @LastEditors  : iron
 * @LastEditTime : 2019-12-27 16:07:09
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
    total: 0,
    reportUrl: '',
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
    saveReportUrl(state, { payload }) {
      const { reportUrl } = payload;
      return {
        ...state,
        reportUrl,
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
      const { err, msg } = yield call(postManual, payload);
      if (err) {
        throw new Error(err);
      }
      message.success(msg);
      yield put({ type: 'reload' });
    },
    *importByAuto({ payload }, { call, put }) {
      const { err, msg } = yield call(postAuto);
      if (err) {
        throw new Error(err);
      }
      message.success(msg);
      yield put({ type: 'reload', payload });
    },
    *fetchReportUrl({ payload }, { call, put, select }) {
      const { err, items } = yield call(getReportUrl, payload);
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'saveReportUrl',
        payload: {
          reportUrl: items,
        },
      });

      // it will return to component
      return yield select(state => state.lop.reportUrl);
    },
    *reload({ payload }, { put }) {
      yield put({ type: 'fetch', payload });
    },
  },
};
