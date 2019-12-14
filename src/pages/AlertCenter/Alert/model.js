/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors: iron
 * @LastEditTime: 2019-12-14 17:50:46
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';
// just for unit test
// `fetch` high order function return anonymous func
export async function getAlerts({ page = 1, pageSize = 10, sort, currentColumn, conditions }) {
  return request('get_alert_center_page_list', {
    data: {
      sort,
      currentColumn,
      conditions: conditions && JSON.stringify(conditions),
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
    },
  });
}

export async function getAlertItems({ alertId, alertTypeId }) {
  return request('get_alert_item_list', { data: { alertTypeId, alertId } });
}

export async function getAlertComments({ alertId }) {
  return request('get_alert_comment_list', {
    data: { alertId },
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
export async function getAssignUsers({ alertItemIds }) {
  return request('get_user_list_by_process_instance_step', {
    data: { alertItemIds: alertItemIds.join(',') },
  });
}
export async function assignAlertItem({ taskIds, userId }) {
  return request('set_alert_item_owner', { data: { taskIds: taskIds.join(','), userId } });
}
export async function closeAlert({ alertIds }) {
  return request('set_alert_close', { data: { alertIds: alertIds.join(',') } });
}
export default {
  namespace: 'alertCenter',
  state: {
    alerts: [],
    alertItems: [],
    total: 0,
    alertItemsTotal: 0,
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
      const { comments } = payload;
      return {
        ...state,
        comments,
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
    closeFail(state, { payload }) {
      const { msg } = payload;
      message.warn(msg);
      return state;
    },
    assignUserOk(state) {
      message.success('assign success');
      return {
        ...state,
      };
    },
    claimOk(state, { payload }) {
      const { alertIds, userName } = payload;
      const alerts = state.alerts.map(alert => {
        if (alertIds.includes(alert.alertId)) {
          return { ...alert, userName };
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
      const { page, pageSize, currentColumn, sort, conditions } = payload || {};
      const { items, totalCount, err } = yield call(getAlerts, {
        page,
        pageSize,
        sort,
        currentColumn,
        conditions,
      });

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'save',
        payload: {
          alerts: items,
          page,
          total: totalCount,
        },
      });
    },
    *fetchAlertItems({ payload }, { call, put }) {
      const { alertTypeId, alertId } = payload || {};
      const { items, err } = yield call(getAlertItems, { alertTypeId, alertId });
      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'saveAlertItems',
        payload: {
          alertItems: items,
        },
      });
    },
    *fetchComments({ payload }, { call, put }) {
      const { alertId } = payload;
      const { items, err } = yield call(getAlertComments, { alertId });
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
    *fetchAssignUsers({ payload }, { call, put }) {
      const { items, err } = yield call(getAssignUsers, payload);
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
    *assignTask({ payload }, { call, put }) {
      const { err } = yield call(assignAlertItem, payload);
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'assignUserOk',
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
      const { err, items } = yield call(claimAlert, { alertIds });
      if (err || !items || !items.length) {
        throw new Error(err);
      }

      yield put({
        type: 'claimOk',
        payload: {
          alertIds,
          userName: items[0].bcLoginUserName,
        },
      });
      yield put({
        type: 'fetch',
      });
    },
    *close({ payload }, { call, put }) {
      const { alertIds } = payload || [];
      const { err, msg, items } = yield call(closeAlert, { alertIds });
      if (err) {
        throw new Error(err);
      }
      if (msg) {
        yield put({
          type: 'closeFail',
          payload: {
            msg,
          },
        });
      } else if (items) {
        yield put({
          type: 'fetch',
        });
      }
    },
  },
};
