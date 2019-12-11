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
    data: { pageNumber: page.toString(), pageSize: pageSize.toString(), taskCode, type },
  });
}

export async function getTaskDetail({ taskCode }) {
  return request('get_approval_task_detail', { data: { taskCode: taskCode.toString() } });
}

export async function claimTask({ taskCode }) {
  return request('set_task_claim', { data: { taskCode: taskCode.join(',') } });
}

export default {
  namespace: 'approvalCenter',
  state: {
    tasks: [],
    alertItems: [],
    detailItems: {},
    total: 0,
    alertOwner: '',
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
      const { current, pageSize, taskCode, type } = payload || {};
      const { items, totalCount, err } = yield call(getApprovalTaskList, {
        current,
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
          page: current,
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
        message.success('claim failure');
      } else {
        message.success('claim success');
        callback();
      }
      //   yield put({
      //     type: 'claimOk',
      //     payload: {
      //       taskIds,
      //     },
      //   });
    },
  },
};
