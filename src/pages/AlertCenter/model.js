/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-03 09:19:29
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';
// just for unit test
// `fetch` high order function return anonymous func
export async function getAlerts({
  page = 1,
  pageSize = 10,
  sort,
  currentColumn,
  conditions,
  dataTable,
} = {}) {
  return request('get_table_page_list', {
    data: {
      sort,
      currentColumn,
      conditions: conditions && JSON.stringify(conditions),
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      dataTable,
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
export async function getAssignUsers({ taskIds }) {
  return request('get_user_list_by_process_instance_step', {
    data: { taskIds: taskIds.join(',') },
  });
}
export async function assignAlertItem({ taskIds, userId }) {
  return request('set_alert_item_owner', { data: { taskIds: taskIds.join(','), userId } });
}
export async function closeAlert({ alertIds = [] }) {
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
export async function getEmailByType(params) {
  return request('get_email_by_alert_id', {
    data: {
      ...params,
      alertId: '888',
    },
  });
}

export default {
  namespace: 'alertCenter',
  state: {
    infos: [],
    infoTotal: 0,
    alerts: [],
    alertTotal: 0,
    alertItems: [],
    comments: [],
    logs: [],
    users: [],
    claimInfos: [],
    email: '',
  },
  reducers: {
    save(state, { payload }) {
      const { alerts, alertTotal } = payload;
      return {
        ...state,
        alerts,
        alertTotal,
      };
    },
    saveInfos(state, { payload }) {
      const { infos, infoTotal } = payload;
      return {
        ...state,
        infos,
        infoTotal,
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
    reclaim(state, { payload }) {
      return {
        ...state,
        claimInfos: payload.claimInfos,
      };
    },
    saveEmail(state, { payload }) {
      return {
        ...state,
        email: payload.email,
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { items, totalCount, err } = yield call(getAlerts, {
        ...payload,
        dataTable: 'SLOP_BIZ.V_ALERT_CENTER',
      });

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'save',
        payload: {
          alerts: items,
          alertTotal: totalCount,
        },
      });
    },
    *fetchInfos({ payload }, { call, put }) {
      const { items, totalCount, err } = yield call(getAlerts, {
        ...payload,
        dataTable: 'SLOP_BIZ.V_INFO',
      });

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'saveInfos',
        payload: {
          infos: items,
          infoTotal: totalCount,
        },
      });
    },
    *fetchAlertItems({ payload }, { call, put }) {
      const { items, err } = yield call(getAlertItems, payload);
      if (err) {
        yield put({
          type: 'saveAlertItems',
          payload: {
            alertItems: [],
          },
        });
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
        yield put({
          type: 'saveComments',
          payload: {
            comments: [],
          },
        });
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
        yield put({
          type: 'saveLogs',
          payload: {
            logs: [],
          },
        });
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
        yield put({
          type: 'saveUsers',
          payload: {
            users: [],
          },
        });
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
      const { msg, err } = yield call(assignAlertItem, rest);
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
      message.success(msg);
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
      yield put({
        type: 'fetchLogs',
        payload: {
          alertId,
        },
      });
    },
    *claim({ payload }, { call, put }) {
      const { err, msg, items } = yield call(claimAlert, payload);
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
        message.success(msg);
      }
    },
    *close({ payload }, { call, put }) {
      const { err } = yield call(closeAlert, payload);
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'fetch',
      });
    },
    *export({ payload }, { call }) {
      const { err } = yield call(exportAlert, payload);
      if (err) {
        throw new Error(err);
      }
    },
    *fetchEmail({ payload }, { call, put }) {
      const { err, items } = yield call(getEmailByType, {
        alertId: payload.alertId,
        operType: 'emailByAlert',
      });
      if (err) {
        return err;
      }
      yield put({
        type: 'saveEmail',
        payload: {
          email: items,
        },
      });
      return '';
    },
    *sendEmail({ payload }, { call }) {
      const { err, msg } = yield call(getEmailByType, {
        alertId: payload.alertId,
        operType: 'emailStatusChanged',
      });
      if (err) {
        throw new Error(err);
      }
      message.success(msg);
    },
  },
};
