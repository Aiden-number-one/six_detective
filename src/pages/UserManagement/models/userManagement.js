import Service from '@/utils/Service';
import fetch from '@/utils/request.default';
import { formatTree } from '@/utils/utils';

const { getUserList, addUser, updateUser, operationUser } = Service;
export const userManagementModel = {
  namespace: 'userManagement',
  state: {
    data: [],
    orgs: [],
    datas: {},
    operationDatas: {},
    updateDatas: {},
  },
  effects: {
    *userManagemetDatas({ payload }, { call, put }) {
      const response = yield call(getUserList, { param: payload });
      if (response.bcjson.flag === '1' || !response.bcjson.flag) {
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
    *updateUserModelDatas({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'updateDatas',
            payload: response.bcjson.items,
          });
        }
        callback();
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
    *queryOrgs(action, { call, put }) {
      const { items } = yield call(fetch('get_departments_info'), action.params);
      yield put({
        type: 'getOrgs',
        payload: items,
      });
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
    updateDatas(state, action) {
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
    getOrgs(state, { payload: orgs }) {
      return {
        ...state,
        orgs: formatTree(orgs),
      };
    },
  },
};
export default userManagementModel;
