import fetch from '@/utils/request.default';
import { formatTree } from '@/utils/utils';

export default {
  namespace: 'auth',
  state: {
    orgs: [],
    employees: [],
    departments: [],
    roleGroups: [],
    roleMenus: [],
    checkedRoleMenus: [],
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
    getRoleGroups(state, { payload: roleGroups }) {
      return {
        ...state,
        roleGroups,
      };
    },
    getRoleMenus(state, { payload: roleMenus }) {
      return {
        ...state,
        roleMenus: formatTree(roleMenus, 'menuId', 'parentMenuId'),
      };
    },
    getCheckedRoleMenus(state, { payload: checkedRoleMenus }) {
      return {
        ...state,
        checkedRoleMenus: checkedRoleMenus.map(item => item.menuId),
      };
    },
  },
  effects: {
    // user role
    // *setPersonRole(action, { call, put }) {},
    // *queryPersonRole(action, { call, put }) {},
    // *delPersonRole(action, { call, put }) {},
    // role group
    // *addRoleGroup(action, { call, put }) {},
    *queryRoleGroups({ params }, { call, put }) {
      const { items } = yield call(fetch('get_role_group_query'), params);
      yield put({
        type: 'getRoleGroups',
        payload: items,
      });
    },
    // *updateRoleGroup(action, { call, put }) {},
    // *delRoleGroup(action, { call, put }) {},
    // roles
    // *queryRole(action, { call, put }) {},
    // *delRole(action, { call, put }) {},
    // *updateRole(action, { call, put }) {},
    // role menu
    *setRoleMenu({ params }, { call }) {
      const { items } = yield call(fetch('set_role_menu_update'), params);
      console.log(items);
    },
    *queryRoleMenus(action, { call, put }) {
      const { items } = yield call(fetch('get_acl_menu'), action.params);
      yield put({
        type: 'getRoleMenus',
        payload: items,
      });
    },
    *queryRoleMenusById(action, { call, put }) {
      const { items } = yield call(fetch('get_role_menu_info'), action.params);
      yield put({
        type: 'getCheckedRoleMenus',
        payload: items[0],
      });
    },
    // department
    *queryOrgs(action, { call, put }) {
      yield call(fetch('get_mail_config_list'));
      const { items } = yield call(fetch('get_departments_info'), action.params);
      console.log(items[0]);

      yield put({
        type: 'getOrgs',
        payload: items,
      });
    },
    *queryDepartments(action, { call, put }) {
      const { items } = yield call(fetch('get_department'), action.params);

      if (items.length > 0) {
        yield put({
          type: 'getDepartments',
          payload: items[0].menu || [],
        });
      }
    },
    *addDepartment(action, { call }) {
      const { items } = yield call(fetch('set_department_add'), action.params);
      console.log(items);
    },
    *updateDepartment(action, { call }) {
      const { items } = yield call(fetch('set_department_update'), action.params);
      console.log(items);
    },
    *delDepartment(action, { call }) {
      const { items } = yield call(fetch('set_department_delete'), action.params);
      console.log(items);
    },
    *queryEmployees({ params }, { call, put }) {
      const { items } = yield call(fetch('get_user_list_impl'), params);
      yield put({
        type: 'getEmployees',
        payload: items.items,
      });
    },
  },
};
