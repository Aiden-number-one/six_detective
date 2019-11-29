/*
 * @Description: 获取数据集列表
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime: 2019-11-28 17:48:27
 * @LastEditors: lan
 */
// import { message } from 'antd';
import Service from '@/utils/Service';

const { getClassifyTree, getDataSet } = Service;

export default {
  namespace: 'dataSet',
  state: {
    classifyTreeData: [], // 树列表
    dataSetData: [], // 数据集
  },
  effects: {
    // 获取数据集分类树
    *getClassifyTree({ payload, callback }, { call, put }) {
      const response = yield call(getClassifyTree, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据集分类树
        yield put({
          type: 'setClassifyTreeData',
          payload: response.bcjson.items,
        });
        if (response.bcjson.items[0]) {
          // 默认选中第一个
          yield put({
            type: 'getDataSet',
            payload: {
              taskId: response.bcjson.items[0].classId,
              isShare: 0,
            },
          });
          if (callback) callback(response);
        }
      }
    },
    // 获取数据集
    *getDataSet({ payload }, { call, put }) {
      const response = yield call(getDataSet, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据集
        yield put({
          type: 'saveDataSetData',
          payload: response.bcjson.items,
        });
      }
    },
  },
  reducers: {
    setClassifyTreeData(state, action) {
      return {
        ...state,
        classifyTreeData: action.payload,
      };
    },
    saveDataSetData(state, action) {
      return {
        ...state,
        dataSetData: action.payload,
      };
    },
  },
};
