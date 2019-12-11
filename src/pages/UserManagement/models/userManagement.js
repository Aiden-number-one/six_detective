import Service from '@/utils/Service';
import fetch from '@/utils/request.default';
import { formatTree } from '@/utils/utils';

const {
  getUserList,
  addUser,
  updateUser,
  operationUser,
  getMenuUserGroup,
  getAlertUserGroup,
} = Service;
export const userManagement = {
  namespace: 'userManagement',
  state: {
    data: [],
    orgs: [],
    menuData: [],
    datas: {},
    operationDatas: {},
    saveUser: {},
    updateData: [],
    alertData: [],
  },
  effects: {
    *userManagemetDatas({ payload }, { call, put }) {
      const response = yield call(getUserList, { param: payload });
      if (response.bcjson.flag === '1' || !response.bcjson.flag) {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson,
          });
        }
      }
    },
    *newUser({ payload, callback }, { call, put }) {
      const response = yield call(addUser, { param: payload });
      if (response.bcjson.flag === '1' || !response.bcjson.flag) {
        yield put({
          type: 'save',
          payload: response.bcjson.items,
        });
        callback();
      }
    },
    *getMenuUserGroup({ payload }, { call, put }) {
      const response = yield call(getMenuUserGroup, { param: payload });
      const userMenu = response.bcjson.items.map(element => ({
        label: element.groupName,
        value: element.groupId,
      }));

      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: userMenu,
          });
        }
      }
    },
    *getAlertUserGroup({ payload }, { call, put }) {
      const response = yield call(getAlertUserGroup, { param: payload });
      const userMenu = response.bcjson.items.map(element => ({
        label: element.groupName,
        value: element.groupId,
      }));
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'alertUserGroup',
            payload: userMenu,
          });
        }
      }
    },
    *addUserModelDatas({ payload, callback }, { call, put }) {
      const response = yield call(addUser, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'addDatas',
          payload: response.bcjson.items,
        });
        callback();
      }
    },
    *updateUserModelDatas({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, { param: payload });
      if (response.bcjson.flag === '1') {
        yield put({
          type: 'updateDatas',
          payload: response.bcjson.items,
        });
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
        }
      }
      callback();
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
    save(state, action) {
      return {
        ...state,
        saveUser: action.payload,
      };
    },
    getDatas(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
    alertUserGroup(state, action) {
      return {
        ...state,
        alertData: action.payload,
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
        updateData: action.payload,
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
export default userManagement;
