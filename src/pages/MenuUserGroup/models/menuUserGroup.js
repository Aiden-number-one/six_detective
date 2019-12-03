/*
 * @Description:
 * @Author: dailinbo
 * @Date: 2019-11-01 11:02:37
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-12-02 15:38:55
 */
import Service from '@/utils/Service';

const { getMenuUserGroup } = Service;

const menuUserGroup = {
  namespace: 'menuUserGroup',
  state: {
    data: [],
  },
  effects: {
    *getMenuUserGroup({ payload }, { call, put }) {
      const response = yield call(getMenuUserGroup, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
      }
    },
  },
  reducers: {
    getDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default menuUserGroup;
