/*
 * @Des: alert center model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-12-02 19:36:07
 * @LastEditors: iron
 * @LastEditTime: 2019-12-09 16:06:48
 */
import { message } from 'antd';
import { request } from '@/utils/request.default';

// import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './AlertList';

// just for unit test
// `fetch` high order function return anonymous func
export async function getApprovalTaskList({ page = 1, pageSize = 10, taskCode, type }) {
  return request('get_approval_task_list_page', {
    data: {
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
      taskCode: taskCode ? taskCode.toString() : '',
      type,
    },
  });
}

export async function getTaskDetail({ taskCode }) {
  return request('get_approval_task_detail', { data: { taskCode: taskCode.toString() } });
}

export async function claimTask({ taskCode }) {
  return request('set_task_claim', { data: { taskCode: taskCode.join(',') } });
}

export async function setTaskSave(data) {
  return request('set_approval_task_data_save', {
    data,
  });
}

export async function setTaskSubmit({ taskCode, userId, epCname }) {
  return request('set_task_submit', {
    data: { taskCode: taskCode.toString(), userId: userId.toString(), epCname },
  });
}
export async function approveAndReject(data) {
  return request('set_task_approve_and_reject', {
    data,
  });
}
export async function setTaskWithdraw({ taskCode, comment }) {
  return request('set_task_withdraw', {
    data: { taskCode: taskCode.toString(), comment },
  });
}
export async function setTaskAssign({ taskCode, userId }) {
  return request('set_task_assign', {
    data: { taskCode: taskCode.toString(), userId: userId.toString() },
  });
}
export async function getTaskGroup({ taskCode }) {
  return request('get_approval_task_node_group', {
    data: { taskCode: taskCode.toString() },
  });
}

export async function getUserList({ operType, groupId }) {
  return request('get_user_list_information', {
    data: { operType, groupId },
  });
}
export async function getUserListByUserId() {
  return request('get_user_list_by_user_id', {
    data: {},
  });
}
export async function getApprovalTaskHistory({ taskCode }) {
  return request('get_approval_task_history', {
    data: { taskCode: taskCode.toString() },
  });
}

export default {
  namespace: 'approvalCenter',
  state: {
    tasks: [],
    alertItems: [],
    detailItems: {},
    total: 0,
    alertOwner: '',
    userList: [],
    submitRadioList: [],
    currentUserList: [],
    assignRadioList: [],
    taskGroup: '',
    taskHistoryList: [],
    logList: [],
  },
  reducers: {
    save(state, { payload }) {
      const { tasks, page, total } = payload;
      return {
        ...state,
        tasks,
        page,
        total,
      };
    },
    saveDetail(state, { payload }) {
      const { detailItems } = payload;
      return {
        ...state,
        detailItems,
      };
    },
    saveTaskGroup(state, { payload }) {
      const { taskGroup } = payload;
      return {
        ...state,
        taskGroup,
      };
    },
    saveUserList(state, { payload }) {
      const { userList } = payload;
      const submitRadioList = userList.map(item => ({ label: item.userName, value: item.userId }));
      return {
        ...state,
        userList,
        submitRadioList,
      };
    },
    saveCurrentUserList(state, { payload }) {
      const { currentUserList } = payload;
      const assignRadioList = currentUserList.map(item => ({
        label: item.userName,
        value: item.userId,
      }));
      return {
        ...state,
        currentUserList,
        assignRadioList,
      };
    },

    saveTaskHistory(state, { payload }) {
      const { taskHistoryList, logList } = payload;
      return {
        ...state,
        taskHistoryList,
        logList,
      };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { page, pageSize, taskCode, type } = payload || {};
      const { items, totalCount, err } = yield call(getApprovalTaskList, {
        page,
        pageSize,
        taskCode,
        type,
      });

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'save',
        payload: {
          tasks: items,
          page,
          total: totalCount,
        },
      });
    },
    *fetchTaskDetail({ payload }, { call, put }) {
      const { taskCode } = payload || {};
      const { items, err } = yield call(getTaskDetail, { taskCode });
      if (err) {
        throw new Error(err);
      }
      yield put({
        type: 'saveDetail',
        payload: {
          detailItems: items,
        },
      });
    },
    *claim({ payload, callback }, { call }) {
      const { taskCode } = payload || [];
      const { err } = yield call(claimTask, { taskCode });
      if (err) {
        message.error('claim failure');
      } else {
        message.success('claim success');
        callback();
      }
    },
    *saveTask({ payload }, { call }) {
      // const { taskCode, epCname } = payload || [];
      const { err } = yield call(setTaskSave, payload);
      if (err) {
        message.error('save failure');
      } else {
        message.success('save success');
      }
    },
    *submitTask({ payload }, { call }) {
      const { taskCode, userId, epCname } = payload || [];
      const { err } = yield call(setTaskSubmit, { taskCode, userId, epCname });
      if (err) {
        message.error('submit failure');
      } else {
        message.success('submit success');
      }
    },
    *approveAndReject({ payload, callback }, { call }) {
      // const { taskCode, userId, type, epCname, comment, attachment } = payload || [];
      const { err } = yield call(approveAndReject, payload);
      if (err) {
        message.error('failure');
      } else {
        message.success('success');
        callback();
      }
    },
    *setTaskWithdraw({ payload, callback }, { call }) {
      const { taskCode, comment } = payload || [];
      const { err } = yield call(setTaskWithdraw, { taskCode, comment });
      if (err) {
        message.error('Withdraw failure');
      } else {
        message.success('Withdraw success');
        callback();
      }
    },
    *setTaskAssign({ payload, callback }, { call }) {
      const { taskCode, userId } = payload || [];
      const { err } = yield call(setTaskAssign, { taskCode, userId });
      if (err) {
        message.error('Assign failure');
      } else {
        message.success('Assign success');
        callback();
      }
    },
    *featchTaskGroup({ payload }, { call, put }) {
      const { taskCode } = payload || [];
      const { items, err } = yield call(getTaskGroup, { taskCode });
      if (err) {
        message.error('getTaskGroup failure');
      }
      yield put({
        type: 'saveTaskGroup',
        payload: {
          taskGroup: items,
        },
      });
    },
    *fetchUserList({ payload }, { call, put }) {
      const { operType, groupId } = payload || [];
      const { items, err } = yield call(getUserList, { operType, groupId });
      if (err) {
        // message.error('getUserList failure');
        return;
      }
      yield put({
        type: 'saveUserList',
        payload: {
          userList: items,
        },
      });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    *getUserListByUserId({ payload }, { call, put }) {
      const { items, err } = yield call(getUserListByUserId);
      if (err) {
        // message.error('getUserList failure');
        return;
      }
      yield put({
        type: 'saveCurrentUserList',
        payload: {
          currentUserList: items,
        },
      });
    },
    *getApprovalTaskHistory({ payload }, { call, put }) {
      const { taskCode } = payload || [];
      const { items, err } = yield call(getApprovalTaskHistory, { taskCode });
      if (err) {
        // message.error('getUserList failure');
        return;
      }
      yield put({
        type: 'saveTaskHistory',
        payload: {
          taskHistoryList: items.approvalHistory,
          logList: items.taskLifecycle,
        },
      });
    },
  },
};
