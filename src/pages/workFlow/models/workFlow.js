import Service from '@/utils/Service';

const { getFolderMenu } = Service;
const taskSwitch = {
  namespace: 'taskSwitch',
  state: {
    data: [],
  },
  effects: {
    *getFolderMenuList({ payload }, { call, put }) {
      const response = yield call(getFolderMenu, { param: payload });
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
        data: action.payload,
      };
    },
  },
};

export default taskSwitch;
