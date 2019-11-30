import { parse, stringify } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import uuidv1 from 'uuid/v1';
import Service from '@/utils/Service';

const { getLogin, getLoginStatus, logout } = Service;

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
      const BCTID = uuidv1().replace(/-/g, '');
      localStorage.setItem('BCTID', BCTID);
      const response = yield call(getLogin, { param: payload });
      if (response.bcjson.flag === '1') {
        if (callback) callback(response);
      } else {
        message.error(response.bcjson.msg);
      }
    },
    *getLoginStatus({ callback, payload }, { call, put }) {
      const response = yield call(getLoginStatus, { param: payload });
      if (response.bcjson.flag === '1') {
        const item = response.bcjson.items[0];
        if (item.isNeedLock === 'Y' || item.IpOrAgentOrAlllow !== 'Allow') {
          message.warning('您的账号在其他地方登录,请重新登录');
          yield put({
            type: 'logout',
          });
        }
      }
      // if (response.bcjson.flag === '001') {
      //   message.error('您的登录信息已失效,请重新登录')
      // }
      if (callback) callback(response);
    },
    *logout(_, { call, put }) {
      // const { redirect } = getPageQuery();
      yield call(logout, { param: {} });
      if (window.location.pathname !== '/login') {
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
