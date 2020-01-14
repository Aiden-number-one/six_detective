/*
 * @Description: lan
 * @Author: lan
 * @Date: 2019-08-28 10:01:59
 * @LastEditTime : 2020-01-13 19:29:49
 * @LastEditors  : iron
 */
import fetch from '@/utils/request.default';

const global = {
  namespace: 'global',
  state: {
    notices: [],
    collapsed: false,
    filterItems: [],
  },
  effects: {
    *fetchTableFilterItems({ payload }, { call }) {
      const { err, items } = yield call(fetch('get_table_column_filter_list'), payload);
      if (err) {
        throw new Error(err);
      }
      return items;
    },
    *fetchZipAttachments({ payload }, { call }) {
      const { err, items } = yield call(fetch('set_attachment_download_batch'), payload);
      if (err) {
        throw new Error(err);
      }
      return items;
    },
  },
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
