/*
 * @Description: 获取数据集列表
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime: 2019-11-28 14:34:59
 * @LastEditors: lan
 */
// import { message } from 'antd';
import Service from '@/utils/Service';

const { getClassifyTree } = Service;

export default {
  namespace: 'dataSet',
  state: {
    classifyTreeData: [], // 树列表
  },
  effects: {
    // 获取数据集树
    *getClassifyTree({ payload, callback }, { call, put }) {
      const response = yield call(getClassifyTree, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据集树
        yield put({
          type: 'setClassifyTreeData',
          payload: response.bcjson.items,
        });
        if (response.bcjson.items[0]) {
          // 默认选中第一个
          //   yield put({
          //     type: 'setActiveCID',
          //     payload: response.bcjson.items[0].connectionId,
          //   });
          if (callback) callback(response);
        }
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
  },
};
