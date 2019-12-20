/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors  : iron
 * @LastEditTime : 2019-12-19 13:54:28
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
export async function setAlertComment({ alertId, content, fileList = [] }) {
  return request('set_alert_comment', {
    data: { alertId, commentContent: content, fileList: fileList.toString() },
  });
}
export async function claimAlert({ alertIds, isCoverClaim }) {
  return request('set_alert_claim', {
    data: { alertIds: alertIds.join(','), isCoverClaim: isCoverClaim.toString() },
  });
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
export async function exportAlert({ fileType }) {
  return request('set_data_file_export', {
    data: {
      apiName: 'bayconnect.superlop.get_alert_center_page_list',
      apiVersion: 'v2.0',
      fileType,
    },
  });
}
export default {
  namespace: 'alertCenter',
  state: {
    alerts: [],
    alertItems: [],
    total: 0,
    comments: [],
    logs: [],
    users: [],
    claimInfos: [],
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
    assignUserOk(state) {
      message.success('assign success');
      return {
        ...state,
      };
    },
    reclaim(state, { payload }) {
      return {
        ...state,
        claimInfos: payload.claimInfos,
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
      const { alertId, alertTypeId, ...rest } = payload;
      const { err } = yield call(assignAlertItem, rest);
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'fetch',
      });
      yield put({
        type: 'fetchAlertItems',
        payload: {
          alertTypeId,
          alertId,
        },
      });
      yield put({
        type: 'assignUserOk',
      });
    },
    *postComment({ payload }, { call, put }) {
      const { alertId, content, fileList } = payload;
      const { err } = yield call(setAlertComment, { alertId, content, fileList });
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
      const { alertIds, isCoverClaim } = payload || [];
      const { err, items } = yield call(claimAlert, { alertIds, isCoverClaim });
      if (err) {
        throw new Error(err);
      }

      if (items && items.length > 0) {
        yield put({
          type: 'reclaim',
          payload: {
            claimInfos: items,
          },
        });
      } else {
        yield put({
          type: 'fetch',
        });
        message.success('claim success');
      }
    },
    *close({ payload }, { call, put }) {
      const { alertIds } = payload || [];
      const { err } = yield call(closeAlert, { alertIds });
      if (err) {
        yield Promise.reject(err);
      }
      yield put({
        type: 'fetch',
      });
    },
    *export({ payload }, { call }) {
      const { err } = yield call(exportAlert, payload);
      if (err) {
        yield Promise.reject(err);
      }
    },
  },
};
