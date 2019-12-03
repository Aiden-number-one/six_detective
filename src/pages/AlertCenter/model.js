import fetch from '@/utils/request.default';

export default {
  namespace: 'alertCenter',
  state: {
    alerts: [],
  },
  reducers: {
    saveAlerts(state, { payload: alerts }) {
      return {
        ...state,
        alerts,
      };
    },
  },
  effects: {
    *fetchAlerts({ params }, { call, put }) {
      const { items } = yield call(fetch('alerts'), params);
      yield put({
        type: 'saveAlerts',
        payload: items,
      });
    },
  },
};
