/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-14 14:13:38
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';
import { defaultPage, defaultPageSize } from '@/pages/DataImportLog/constants';
// just for unit test
// `fetch` high order function return anonymous func
export async function getTableList({
  sort,
  dataTable,
  conditions,
  currentColumn,
  page = defaultPage,
  pageSize = defaultPageSize,
} = {}) {
  return request('get_table_page_list', {
    data: {
      sort,
      dataTable,
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
export async function discontinueAlert({ alertIds = [] }) {
  return request('set_alert_discontinue', { data: { alertIds: alertIds.join(',') } });
}
export async function getTaskHistory({ taskId }) {
  return request('get_history_list_for_item_detail', {
    data: { taskId: taskId.toString() },
  });
}
export async function exportAlerts({ alertId }) {
  return request('set_alert_data_file_export', {
    data: {
      alertId: alertId.toString(),
    },
  });
}
export async function exportInfos({ infoId }) {
  return request('set_information_data_file_export', {
    data: {
      infoId: infoId.toString(),
    },
  });
}
export async function getEmailByType(params) {
  return request('get_email_by_alert_id', {
    data: params,
  });
}

export default {
  namespace: 'alertCenter',
  state: {
    infos: [],
    infoPage: defaultPage,
    infoPageSize: defaultPageSize,
    infoTotal: 0,
    alerts: [],
    alertPage: defaultPage,
    alertPageSize: defaultPageSize,
    alertTotal: 0,
    alertItems: [],
    comments: [],
    logs: [],
    users: [],
    email: [],
    attachments: [],
  },
  reducers: {
    save(state, { payload }) {
      const {
        alerts,
        alertPage = defaultPage,
        alertPageSize = defaultPageSize,
        alertTotal,
      } = payload;
      return {
        ...state,
        alerts,
        alertPage,
        alertPageSize,
        alertTotal,
      };
    },
    saveInfos(state, { payload }) {
      const { infos, infoPage = defaultPage, infoPageSize = defaultPageSize, infoTotal } = payload;
      return {
        ...state,
        infos,
        infoPage,
        infoPageSize,
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
    saveEmail(state, { payload }) {
      return {
        ...state,
        email: payload.email,
      };
    },
    saveAttachments(state, { payload }) {
      return {
        ...state,
        attachments: payload.attachments,
      };
    },
  },
  effects: {
    *fetch({ payload = {} }, { call, put }) {
      const { page, pageSize } = payload;
      const { items, totalCount, err } = yield call(getTableList, {
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
          alertPage: page,
          alertPageSize: pageSize,
          alertTotal: totalCount,
        },
      });
    },
    *exportAlerts({ payload }, { call }) {
      const { err, items } = yield call(exportAlerts, payload);
      if (err) {
        throw new Error(err);
      }
      return items;
    },
    *fetchInfos({ payload = {} }, { call, put }) {
      const { page, pageSize } = payload;
      const { items, totalCount, err } = yield call(getTableList, {
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
          infoPage: page,
          infoPageSize: pageSize,
          infoTotal: totalCount,
        },
      });
    },
    *exportInfos({ payload }, { call }) {
      const { err, items } = yield call(exportInfos, payload);
      if (err) {
        throw new Error(err);
      }
      return items;
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
    // claim or check alert status
    *claim({ payload }, { call, put }) {
      const { err, msg, items } = yield call(claimAlert, {
        alertIds: payload.alertIds,
        isCoverClaim: 0,
      });
      if (err) {
        throw new Error(err);
      }

      if (items && items.length > 0) {
        return items;
      }
      yield put({
        type: 'fetch',
      });
      message.success(msg);
      return '';
    },
    // claim many or check alert status
    *claimMany({ payload }, { call, put }) {
      return yield put({
        type: 'claim',
        payload,
      });
    },
    // claim alert(s) which has been claimed
    *reClaim({ payload }, { call, put }) {
      const { err, msg } = yield call(claimAlert, {
        alertIds: payload.alertIds,
        isCoverClaim: 1,
      });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'fetch',
      });
      message.success(msg);
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
    *discontinue({ payload }, { call, put }) {
      const { err } = yield call(discontinueAlert, payload);
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'fetch',
      });
    },
    *fetchAttachments({ payload }, { call, put }) {
      const { err, items } = yield call(getEmailByType, {
        alertId: payload.alertId,
        operType: 'queryUrlByAlertId',
      });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'saveAttachments',
        payload: {
          attachments: items,
        },
      });
    },
    *fetchEmail({ payload }, { call, put }) {
      const { err, items } = yield call(getEmailByType, {
        alertId: payload.alertId,
        operType: 'emailByAlert',
      });
      if (err) {
        message.warn(err.slice(0, 150));
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
    *fetchTaskHistory({ payload }, { call, put }) {
      const { err, items = {} } = yield call(getTaskHistory, payload);
      if (err) {
        throw new Error(err);
      }
      return items;
    },
  },
};
