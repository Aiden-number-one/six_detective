import { message } from 'antd';
import Service from '@/utils/Service';

const { getTemplate, templateSave } = Service;
export default {
  namespace: 'templateConfig',
  state: {
    data: [],
  },

  effects: {
    *templateDatas({ payload }, { call, put }) {
      const response = yield call(getTemplate, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *templateEdit({ payload, callback }, { call }) {
      const response = yield call(templateSave, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('保存成功');
        callback();
      }
    },
  },

  reducers: {
    setDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
