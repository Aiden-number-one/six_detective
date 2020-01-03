/*
 * @Description: information
 * @Author: lan
 * @Date: 2020-01-02 15:08:11
 * @LastEditTime : 2020-01-03 18:46:16
 * @LastEditors  : lan
 */
import Service from '@/utils/Service';

const {
  getInformation, // 获取information
} = Service;

export default {
  namespace: 'information',

  state: {
    informationData: [], // information Data
  },

  effects: {
    // 获取information
    *getInformation({ payload }, { call, put }) {
      const response = yield call(getInformation, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'setInformation',
          payload: response.bcjson.items,
        });
      }
    },
  },

  reducers: {
    // Save information data
    setInformation(state, action) {
      return {
        ...state,
        informationData: action.payload,
      };
    },
  },
};
