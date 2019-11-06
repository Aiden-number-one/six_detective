import fetch from '@/utils/request2';
import { formatTree } from '@/utils/utils';

export default {
  namespace: 'auth',
  state: {
    orgs: [],
    employees: [],
    departments: [],
  },
  reducers: {
    getOrgs(state, { payload: orgs }) {
      return {
        ...state,
        orgs: formatTree(orgs),
      };
    },
    getDepartments(state, { payload: departments }) {
      return {
        ...state,
        departments,
      };
    },
    getEmployees(state, { payload: employees }) {
      return {
        ...state,
        employees,
      };
    },
  },
  effects: {
    // user role
    // *setPersonRole(action, { call, put }) {},
    // *queryPersonRole(action, { call, put }) {},
    // *delPersonRole(action, { call, put }) {},
    // // // role group
    // *addRoleGroup(action, { call, put }) {},
    // *queryRoleGroup(action, { call, put }) {},
    // *updateRoleGroup(action, { call, put }) {},
    // *delRoleGroup(action, { call, put }) {},
    // // // roles
    // *queryRole(action, { call, put }) {},
    // *delRole(action, { call, put }) {},
    // *updateRole(action, { call, put }) {},
    // // // role menu
    // *setRoleMenu(action, { call, put }) {},
    // *delRoleMenu(action, { call, put }) {},
    // *queryRoleMenu(action, { call, put }) {},
    // department
    *queryOrgs(action, { call, put }) {
      const { bcjson } = yield call(fetch('get_departments_info'), action.params);

      yield put({
        type: 'getOrgs',
        payload: bcjson.items,
      });
    },
    *queryDepartment(action, { call, put }) {
      const { bcjson } = yield call(fetch('get_department'), action.params);
      const { flag, items } = bcjson;
      if (flag === '1' && items.length > 0) {
        console.log('auth effect-queryDepartment');

        yield put({
          type: 'getDepartments',
          payload: items[0].menu || [],
        });
      }
    },
    *addDepartment(action, { call }) {
      const { bcjson } = yield call(fetch('set_department_add'), action.params);
      console.log(bcjson);
    },
    *updateDepartment(action, { call }) {
      const { bcjson } = yield call(fetch('set_department_update'), action.params);
      console.log(bcjson);
    },
    *delDepartment(action, { call }) {
      const { bcjson } = yield call(fetch('set_department_delete'), action.params);
      console.log(bcjson);
    },
    *queryEmployees({ params }, { call, put }) {
      const { bcjson } = yield call(fetch('get_user_list_impl'), params);
      yield put({
        type: 'getEmployees',
        payload: bcjson.items,
      });
    },
  },
};
