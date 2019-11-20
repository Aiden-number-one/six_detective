/*
 * @Description: This is a TaskSwitch models.
 * @Author: dailinbo
 * @Date: 2019-11-08 14:19:44
 * @LastEditors: dailinbo
 * @LastEditTime: 2019-11-20 11:13:29
 */
import Service from '@/utils/Service';
import fetch from '@/utils/request.default';
// import { formatTree } from '@/utils/utils';

const { getFolderMenu } = Service;
const taskSwitch = {
  namespace: 'taskSwitch',
  state: {
    data: [],
    orgs: [],
  },
  effects: {
    *getFolderMenuList({ payload }, { call, put }) {
      const response = yield call(getFolderMenu, { param: payload });
      if (response.bcjson.flag === '1') {
        // let newItems = 1;
        // newItems = formatTree(response.bcjson.items, '', '');
        // let newItmes = [];
        // yield (newItmes = formatTree(response.bcjson.items, 'folderId', 'parentId'));
        // yield (response.bcjson.items = newItmes);
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
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
    getDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getOrgs(state, { payload: orgs }) {
      return {
        ...state,
        orgs,
      };
    },
  },
};

export default taskSwitch;
