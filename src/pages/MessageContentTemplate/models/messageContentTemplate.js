/*
 * @Description:
 * @Author: dailinbo
 * @Date: 2019-11-01 11:02:37
 * @LastEditors  : dailinbo
 * @LastEditTime : 2019-12-18 09:40:26
 */
import Service from '@/utils/Service';

const { getTemplateList, updateTemplate } = Service;

const messageContentTemplate = {
  namespace: 'messageContentTemplate',
  state: {
    data: [],
    updateData: {},
  },
  effects: {
    *getTemplateList({ payload }, { call, put }) {
      const response = yield call(getTemplateList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
      } else {
        throw new Error(response.bcjson.msg);
      }
    },
    *updateTemplate({ payload, callback }, { call, put }) {
      const response = yield call(updateTemplate, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'update',
          payload: response.bcjson.items,
        });
        callback();
      } else {
        throw new Error(response.bcjson.msg);
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
    update(state, action) {
      return {
        ...state,
        updateData: action.payload,
      };
    },
  },
};

export default messageContentTemplate;
