import Service from '@/utils/Service';

const { getUserList, addUser, operationUser } = Service;
export const userManagementModel = {
  namespace: 'userManagement',
  state: {
    data: [],
    datas: {},
    operationDatas: {},
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
    *addUserModelDatas({ payload }, { call, put }) {
      const response = yield call(addUser, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'addDatas',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *operationUserModelDatas({ payload, callback }, { call, put }) {
      const response = yield call(operationUser, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'operationDatas',
            payload: response.bcjson.items,
          });
          callback();
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
    addDatas(state, action) {
      return {
        ...state,
        datas: action.payload,
      };
    },
    operationDatas(state, action) {
      return {
        ...state,
        datas: action.payload,
      };
    },
  },
};
export default userManagementModel;
