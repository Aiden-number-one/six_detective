/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors: iron
 * @LastEditTime: 2019-12-07 20:22:38
 */
import { request } from '@/utils/request.default';

// import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './AlertList';

// just for unit test
// `fetch` high order function return anonymous func
export async function getAlerts({ page = 1, pageSize = 10 }) {
  return request('get_alert_center_page_list', {
    data: { pageNumber: page.toString(), pageSize: pageSize.toString() },
  });
}

export async function getAlertItems({ alertType }) {
  return request('get_alert_item_list', { data: { mappingId: alertType } });
}

export async function claimAlert({ alertIds }) {
  return request('set_alert_claim', { data: { alertIds } });
}

export default {
  namespace: 'alertCenter',
  state: {
    alerts: [],
    alertItems: [],
    total: 0,
  },
  reducers: {
    save(state, { payload }) {
      const { alerts, page, total } = payload;
      return {
        ...state,
        alerts,
        page,
        total,
      };
    },
    claimOk(state) {
      return {
        ...state,
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { current, pageSize } = payload || {};
      const { items, totalCount, err } = yield call(getAlerts, {
        current,
        pageSize,
      });

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'save',
        payload: {
          alerts: items,
          page: current,
          total: totalCount,
        },
      });
    },
    *fetchAlertItems({ payload }, { call, put }) {
      const { alertType } = payload || {};
      const { items, err } = yield call(getAlertItems, { alertType });
      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'save',
        payload: {
          alertItems: items,
        },
      });
    },
    *claim({ payload }, { call, put }) {
      const { alertIds } = payload || {};
      const { err } = yield call(claimAlert, { alertIds });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'claimOk',
      });
    },
  },
};
