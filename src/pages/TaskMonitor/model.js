/*
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-19 19:31:10
 * @LastEditors: iron
 * @LastEditTime: 2019-11-19 19:55:47
 */
import fetch from '@/utils/request.default';
import { formatTree } from '@/utils/utils';

export default {
  namespace: 'tm',
  state: {
    tasks: [],
  },
  reducers: {
    getTasks(state, { payload: tasks }) {
      return {
        ...state,
        tasks: formatTree(tasks, 'monitorId', 'parentMonitorId'),
      };
    },
  },
  effects: {
    *queryTasks({ params }, { call, put }) {
      const { items } = yield call(fetch('get_all_job_deal_info'), params);
      yield put({
        type: 'getTasks',
        payload: items,
      });
    },
  },
};
