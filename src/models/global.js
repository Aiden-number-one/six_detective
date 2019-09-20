/*
 * @Description: lan
 * @Author: lan
 * @Date: 2019-08-28 10:01:59
 * @LastEditTime: 2019-09-20 10:14:51
 * @LastEditors: mus
 */
const global = {
  namespace: 'global',
  state: {
    notices: [],
    collapsed: false,
  },
  effects: {},
  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default global;
