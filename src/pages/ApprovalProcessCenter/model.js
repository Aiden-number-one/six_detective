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

export async function setTaskSave({ taskCode, epCname }) {
  return request('set_approval_task_data_save', {
    data: { taskCode: taskCode.toString(), epCname },
  });
}

export async function setTaskSubmit({ taskCode, userId, epCname }) {
  return request('set_task_submit', {
    data: { taskCode: taskCode.toString(), userId: userId.toString(), epCname },
  });
}
export async function approveAndReject({ taskCode, userId, type }) {
  return request('set_task_approve_and_reject', {
    data: { taskCode: taskCode.toString(), userId: userId.toString(), type },
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
    taskGroup: '',
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

    // claimOk(state, { payload }) {
    //   const owner = localStorage.getItem('loginName') || '';
    //   const { taskIds } = payload;
    //   const alerts = state.alerts.map(alert => {
    //     if (taskIds.includes(alert.alertId)) {
    //       return { ...alert, owner };
    //     }
    //     return alert;
    //   });

    //   return {
    //     ...state,
    //     alerts,
    //   };
    // },
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
      const { taskCode, epCname } = payload || [];
      const { err } = yield call(setTaskSave, { taskCode, epCname });
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
      const { taskCode, userId, type } = payload || [];
      const { err } = yield call(approveAndReject, { taskCode, userId, type });
      if (err) {
        message.error('failure');
      } else {
        message.success('success');
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
  },
};
