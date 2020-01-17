/*
 * @Description: lan
 * @Author: lan
 * @Date: 2019-08-28 10:01:59
 * @LastEditTime : 2020-01-17 14:41:19
 * @LastEditors  : iron
 */
import fetch, { request } from '@/utils/request.default';
import { defaultPage, defaultPageSize } from '@/pages/DataImportLog/constants';

export async function getTableList({
  sort,
  dataTable,
  conditions,
  currentColumn,
  page = defaultPage,
  pageSize = defaultPageSize,
} = {}) {
  return request('get_table_page_list', {
    data: {
      sort,
      dataTable,
      currentColumn,
      conditions: conditions && JSON.stringify(conditions),
      pageNumber: page.toString(),
      pageSize: pageSize.toString(),
    },
  });
}

export default {
  namespace: 'global',
  state: {
    notices: [],
    collapsed: false,
    filterItems: [],
    filterTables: [],
    filterTableTotal: 0,
    filterTalbePage: defaultPage,
    filterTalbePageSize: defaultPageSize,
    filterParams: {},
  },
  effects: {
    *fetchTableFilterItems({ payload }, { call }) {
      const { err, items } = yield call(fetch('get_table_column_filter_list'), payload);
      if (err) {
        throw new Error(err);
      }
      return items;
    },
    *fetchTableList({ payload }, { call, put }) {
      const { page, pageSize, ...rest } = payload;
      const { items, totalCount, err } = yield call(getTableList, {
        ...rest,
        page,
        pageSize,
      });

      if (err) {
        throw new Error(err);
      }

      yield put({
        type: 'saveFilterTableList',
        payload: {
          filterTables: items,
          filterTalbePage: page,
          filterTalbePageSize: pageSize,
          filterTableTotal: totalCount,
          filterParams: rest,
        },
      });
    },
    *reloadTableList(_, { put, select }) {
      const page = yield select(({ global }) => global.filterTalbePage);
      const pageSize = yield select(({ global }) => global.filterTalbePageSize);
      const alertParams = yield select(({ global }) => global.filterParams);
      yield put({
        type: 'fetchTableList',
        payload: {
          page,
          pageSize,
          ...alertParams,
        },
      });
    },
    *fetchZipAttachments({ payload }, { call }) {
      const { err, items } = yield call(fetch('set_attachment_download_batch'), payload);
      if (err) {
        throw new Error(err);
      }
      return items;
    },
    *fetchLastTradeDate(_, { call }) {
      try {
        const { items } = yield call(fetch('get_last_trading_day_query'));
        if (items && items.length > 0) {
          return items[0];
        }
        return '';
      } catch (e) {
        return '';
      }
    },
  },
  reducers: {
    saveFilterTableList(state, { payload }) {
      const {
        filterTables,
        filterTalbePage,
        filterTalbePageSize,
        filterTableTotal,
        filterParams,
      } = payload;

      return {
        ...state,
        filterTables,
        filterTalbePage,
        filterTalbePageSize,
        filterTableTotal,
        filterParams,
      };
    },
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
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
        // reset filter state
        dispatch({
          type: 'saveFilterTableList',
          payload: {
            filterTables: [],
            filterTalbePage: defaultPage,
            filterTalbePageSize: defaultPageSize,
            filterTableTotal: 0,
            filterParams: {},
          },
        });
      });
    },
  },
};
