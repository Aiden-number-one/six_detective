import { parse, stringify } from 'qs';
import { routerRedux } from 'dva/router';
import Service from '@/utils/Service';

const { getLogin } = Service;

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *getLogin({ callback, payload }, { call }) {
      const response = yield call(getLogin, { param: payload });
      if (callback) callback(response);
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery();

      if (window.location.pathname !== '/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
        window.localStorage.clear();
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
