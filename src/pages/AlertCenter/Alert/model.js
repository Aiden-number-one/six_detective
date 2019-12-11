/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors: iron
 * @LastEditTime: 2019-12-11 10:46:37
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';

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

export async function getAlertComments({ alertId, page = 1, pageSize = 10 }) {
  return request('get_alert_comment_list', {
    data: { alertId, pageNumber: page.toString(), pageSize: pageSize.toString() },
  });
}
export async function getAlertLogs({ alertId, page = 1, pageSize = 10 }) {
  return request('get_alert_log_list', {
    data: { alertId, pageNumber: page.toString(), pageSize: pageSize.toString() },
  });
}
export async function setAlertComment({ alertId, content }) {
  return request('set_alert_comment', {
    data: { alertId, commentContent: content },
  });
}
export async function claimAlert({ alertIds }) {
  return request('set_alert_claim', { data: { alertIds: alertIds.join(',') } });
}
export async function closeAlert({ alertIds }) {
  return request('set_alert_close', { data: { alertIds: alertIds.join(',') } });
}
export async function getUsers() {
  return request('api_get_alert_group_list');
}
export default {
  namespace: 'alertCenter',
  state: {
    alerts: [],
    alertItems: [],
    total: 0,
    alertItemsTotal: 0,
    alertOwner: '',
    comments: [],
    alertCommentsTotal: 0,
    logs: [],
    users: [],
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
    saveAlertItems(state, { payload }) {
      return {
        ...state,
        alertItems: payload.alertItems,
      };
    },
    saveComments(state, { payload }) {
      const { comments } = state;
      return {
        ...state,
        comments: [...comments, ...payload.comments],
      };
    },
    saveLogs(state, { payload }) {
      return {
        ...state,
        logs: payload.logs,
      };
    },
    saveUsers(state, { payload }) {
      return {
        ...state,
        users: payload.users,
      };
    },
    claimOk(state, { payload }) {
      const owner = localStorage.getItem('loginName') || '';
      const { alertIds } = payload;
      const alerts = state.alerts.map(alert => {
        if (alertIds.includes(alert.alertId)) {
          return { ...alert, owner };
        }
        return alert;
      });
      message.success('claim success');

      return {
        ...state,
        alerts,
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
      const { items, totalCount, err } = yield call(getAlertItems, { alertType });
      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'saveAlertItems',
        payload: {
          alertItems: items,
          alertItemsTotal: totalCount,
        },
      });
    },
    *fetchComments({ payload }, { call, put }) {
      const { alertId, page } = payload;
      const { items, err } = yield call(getAlertComments, { alertId, page });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'saveComments',
        payload: {
          comments: items,
        },
      });
    },
    *fetchLogs({ payload }, { call, put }) {
      const { alertId } = payload;
      const { items, err } = yield call(getAlertLogs, { alertId });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'saveLogs',
        payload: {
          logs: items,
        },
      });
    },
    *fetchUsers({ payload }, { call, put }) {
      console.log(payload);

      const { items, err } = yield call(getUsers);
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'saveUsers',
        payload: {
          users: items,
        },
      });
    },
    *postComment({ payload }, { call, put }) {
      const { alertId, content } = payload;
      const { err } = yield call(setAlertComment, { alertId, content });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'fetchComments',
        payload: {
          alertId,
        },
      });
    },
    *claim({ payload }, { call, put }) {
      const { alertIds } = payload || [];
      const { err } = yield call(claimAlert, { alertIds });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'claimOk',
        payload: {
          alertIds,
        },
      });
    },
    *close({ payload }, { call, put }) {
      const { alertIds } = payload || [];
      const { err } = yield call(closeAlert, { alertIds });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'fetch',
      });
    },
  },
};
