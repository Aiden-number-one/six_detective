/*
 * @Des: job monitor model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-11-19 19:31:10
 * @LastEditors: iron
 * @LastEditTime: 2019-11-27 11:00:36
 */
import fetch from '@/utils/request.default';
import { formatTimeString, msFormat, formatTree } from '@/utils/utils';

export default {
  namespace: 'tm',
  state: {
    jobs: [],
    jobDetail: {},
    tasks: [],
    taskPoints: [],
    eachBatches: [],
  },
  reducers: {
    getJobs(state, { payload: t }) {
      const list = [
        { type: 0, name: '出错中断', color: '#ea6b74', icon: 'close-circle', children: [] },
        { type: 1, name: '执行中', color: '#333333', icon: 'fire', children: [] },
        { type: 2, name: '成功完成', color: '#63c9d5', icon: 'check-circle', children: [] },
        { type: 3, name: '出错完成', color: '#f1c40f', icon: 'close-circle', children: [] },
        { type: 4, name: '新建', color: '#bac3d0', icon: 'plus-circle', children: [] },
      ];

      const jobs = list.map(item => {
        t.forEach(v => {
          const { executeFlag } = v;
          if (item.type === 0 && executeFlag === 'B') {
            item.children.push({ ...v, color: item.color });
          }
          if (item.type === 2 && executeFlag === 'S') {
            item.children.push({ ...v, color: item.color });
          }
          if (item.type === 4 && executeFlag === null) {
            item.children.push({ ...v, color: item.color });
          }
        });
        return item;
      });

      return {
        ...state,
        jobs,
      };
    },
    getJobDetail(state, { payload: jobDetail }) {
      return {
        ...state,
        jobDetail,
      };
    },
    getTasksOfJob(state, { payload: tasks }) {
      return {
        ...state,
        tasks: formatTree(tasks, 'monitorId', 'parentMonitorId'),
      };
    },
    getTaskPointsOfJob(state, { payload: taskPoints }) {
      return {
        ...state,
        taskPoints,
      };
    },
    getEachBatch(state, { payload: eachBatches }) {
      const batches = eachBatches.map(item => {
        const { successNum, errorNum, taskSum, startTime, endTime, zxsj } = item;

        if (taskSum > 0) {
          const unExcuteNum = taskSum - successNum - errorNum;
          return {
            ...item,
            zxsjFormat: msFormat(zxsj),
            startTimeFormat: formatTimeString(startTime),
            endTimeFormat: formatTimeString(endTime),
            result: [
              { name: '执行成功', value: successNum },
              { name: '执行失败', value: errorNum },
              { name: '未执行', value: unExcuteNum },
            ],
          };
        }
        return {
          result: [{ name: '执行中', value: 0 }],
        };
      });

      return {
        ...state,
        eachBatches: batches,
      };
    },
  },
  effects: {
    *queryJobs({ params }, { call, put }) {
      const { items } = yield call(fetch('get_all_job_deal_info'), params);
      yield put({
        type: 'getJobs',
        payload: items,
      });
    },
    *queryJobDetail({ params }, { call, put }) {
      const { items } = yield call(fetch('get_job_finish_rate_info'), params);
      if (items.length > 0) {
        yield put({
          type: 'getJobDetail',
          payload: items,
        });
      }
    },
    *queryTasksOfJob({ params }, { call, put }) {
      const { items } = yield call(fetch('get_job_detail_flow_info'), params);
      yield put({
        type: 'getTasksOfJob',
        payload: items,
      });
    },
    *queryTaskPointsOfJob({ params }, { call, put }) {
      const { items } = yield call(fetch('get_job_xml_nodeinfo'), params);
      yield put({
        type: 'getTaskPointsOfJob',
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
