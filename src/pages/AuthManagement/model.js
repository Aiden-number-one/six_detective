import fetch from '@/utils/request2';

export default {
  namespace: 'auth',
  state: {
    departments: [],
  },
  reducers: {
    getDepartments(state, { payload: departments }) {
      // console.log('auth reducer', departments);

      return {
        ...state,
        departments,
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
  },
};
