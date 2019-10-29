import Service from '@/utils/Service';

const { getUserList } = Service;
const userManagementModel = {
  namespace: 'userManagement',
  state: {
    data: {},
  },
  effects: {
    *userManagemetDatas({ payload }, { call, put }) {
      const response = yield call(getUserList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson.items,
          });
        }
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
export default userManagementModel;
