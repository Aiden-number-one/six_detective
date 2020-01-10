/*
 * @Description: approval processing
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-09 16:30:41
 * @LastEditors  : lan
 */
import Service from '@/utils/Service';

const {
  getAllApproval, // 获取information
  getPerApproval,
  getAllTask,
} = Service;

export default {
  namespace: 'approval',

  state: {
    allApprovalData: [], // allApproval Data
    perApprovalData: [], // perApproval Data
    allTaskData: [],
  },

  effects: {
    // 获取information
    *getAllApproval({ payload, callback }, { call, put }) {
      const response = yield call(getAllApproval, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setAllApproval',
          payload: response.bcjson.items,
        });
        if (callback) callback(response.bcjson.items);
      }
    },
    // 获取information
    *getPerApproval({ payload, callback }, { call, put }) {
      const response = yield call(getPerApproval, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setPerApproval',
          payload: response.bcjson.items,
        });
        if (callback) callback(response.bcjson.items);
      }
    },
    *getAllTask({ payload, callback }, { call, put }) {
      const response = yield call(getAllTask, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setAllTask',
          payload: response.bcjson.items,
        });
      }
    },
  },

  reducers: {
    setAllApproval(state, action) {
      return {
        ...state,
        allApprovalData: action.payload,
      };
    },
    setPerApproval(state, action) {
      return {
        ...state,
        perApprovalData: action.payload,
      };
    },
    setAllTask(state, action) {
      return {
        ...state,
        allTaskData: action.payload,
      };
    },
  },
};
