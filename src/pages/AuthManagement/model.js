/*
 * @Des: auth model
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2019-10-31 19:19:30
 * @LastEditors: iron
 * @LastEditTime: 2019-11-19 12:17:23
 */

import fetch from '@/utils/request.default';
import { formatTree } from '@/utils/utils';

export default {
  namespace: 'auth',
  state: {
    orgs: [],
    employees: [],
    departments: [],
    roleGroups: [],
    publicMenus: [],
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
    getPublicMenus(state, { payload: publicMenus }) {
      return {
        ...state,
        publicMenus: formatTree(publicMenus, 'menuId', 'parentMenuId'),
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
    *queryRoleGroups({ params }, { call, put }) {
      const { items } = yield call(fetch('get_role_group_query'), params);
      yield put({
        type: 'getRoleGroups',
        payload: items,
      });
    },
    // role menu
    *queryPublicMenus({ params }, { call, put }) {
      const { items } = yield call(fetch('get_public_menu_info'), params);
      yield put({
        type: 'getPublicMenus',
        payload: items,
      });
    },
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
        payload: items,
      });
    },
    // org / department
    *queryOrgs(action, { call, put }) {
      const { items } = yield call(fetch('get_departments_info'), action.params);

      if (items && items.length > 0) {
        yield put({
          type: 'getOrgs',
          payload: items,
        });
      }
    },
    *queryDepartments(action, { call, put }) {
      const { items } = yield call(fetch('get_department'), action.params);

      if (!items) {
        // throw
      }
      if (items.length > 0) {
        yield put({
          type: 'getDepartments',
          payload: items[0].menu || [],
        });
      }
    },
    *addDepartment(action, { call }) {
      const { msg } = yield call(fetch('set_department_add'), action.params);
      if (msg) {
        return Promise.reject(msg);
      }
      return undefined;
    },
    *updateDepartment(action, { call }) {
      yield call(fetch('set_department_update'), action.params);
    },
    *delDepartment(action, { call }) {
      const { msg } = yield call(fetch('set_department_delete'), action.params);
      if (msg) {
        return Promise.reject(msg);
      }
      return undefined;
    },
    // employee
    *queryEmployees({ params }, { call, put }) {
      const { items } = yield call(fetch('get_user_list_impl'), params);
      yield put({
        type: 'getEmployees',
        payload: items,
      });
    },
  },
};
