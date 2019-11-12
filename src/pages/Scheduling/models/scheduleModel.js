import Service from '@/utils/Service';

const { getSchedule } = Service;

const scheduleModel = {
  namespace: 'schedule',
  state: {
    scheduleList: [],
  },
  effects: {
    *getScheduleList({ payload }, { call, put }) {
      const response = yield call(getSchedule, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
      }
    },
  },
  reducers: {
    getDatas(state, action) {
      return {
        ...state,
        scheduleList: action.payload,
      };
    },
  },
};

export default scheduleModel;
