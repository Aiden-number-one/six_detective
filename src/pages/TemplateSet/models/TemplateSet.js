// import { message } from 'antd';
import Service from '@/utils/Service';

const { getApproval } = Service;
export default {
  namespace: 'approvalApi',

  state: {
    data: [],
  },

  effects: {
    *approvalDatas({ payload }, { call, put }) {
      const response = yield call(getApproval, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'Datas',
            payload: response.bcjson.items,
          });
        }
      }
    },
  },

  reducers: {
    // setDatas(state, action) {
    //   return {
    //     ...state,
    //     data: action.payload,
    //   };
    // },
  },
};
