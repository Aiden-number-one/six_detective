/*
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-19 19:31:10
 * @LastEditors: iron
 * @LastEditTime: 2019-11-21 14:01:03
 */
import fetch from '@/utils/request.default';

export default {
  namespace: 'tm',
  state: {
    tasks: [],
    taskDetail: {},
    taskBatches: [],
    eachBatches: [],
  },
  reducers: {
    getTasks(state, { payload: t }) {
      const list = [
        { type: 0, name: '出错中断', children: [] },
        { type: 1, name: '执行中', children: [] },
        { type: 2, name: '成功完成', children: [] },
        { type: 3, name: '出错完成', children: [] },
        { type: 4, name: '新建', children: [] },
      ];

      const l = list.map(item => {
        t.forEach(v => {
          const { executeFlag } = v;
          if (item.type === 0 && executeFlag === 'B') {
            item.children.push(v);
          }
          if (item.type === 2 && executeFlag === 'S') {
            item.children.push(v);
          }
          if (item.type === 4 && executeFlag === null) {
            item.children.push(v);
          }
        });
        return item;
      });

      return {
        ...state,
        tasks: l,
      };
    },
    getTaskDetail(state, { payload: taskDetail }) {
      return {
        ...state,
        taskDetail,
      };
    },
    getTaskBatches(state, { payload: taskBatches }) {
      return {
        ...state,
        taskBatches,
      };
    },
    getEachBatch(state, { payload: eachBatches }) {
      return {
        ...state,
        eachBatches,
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
    *queryTaskDetail({ params }, { call, put }) {
      const { items } = yield call(fetch('get_job_finish_rate_info'), params);
      if (items.length > 0) {
        yield put({
          type: 'getTaskDetail',
          payload: items,
        });
      }
    },
    *queryTaskBatches({ params }, { call, put }) {
      const { items } = yield call(fetch('get_job_detail_flow_info'), params);
      yield put({
        type: 'getTaskBatches',
        payload: items,
      });
    },
    *queryEachBatch({ params }, { call, put }) {
      const { items } = yield call(fetch('get_each_batch_finish_data_info'), params);
      yield put({
        type: 'getEachBatch',
        payload: items,
      });
    },
  },
};
