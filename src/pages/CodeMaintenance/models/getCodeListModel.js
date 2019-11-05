import Service from '@/utils/Service';

const { codeList, codeItemList, addCodeItem } = Service;
const getCodeListModel = {
  namespace: 'codeList',
  state: {
    data: [],
    itemData: [],
    obj: {},
  },
  effects: {
    *getCodeList({ payload }, { call, put }) {
      const response = yield call(codeList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
      }
    },
    *getCodeItemList({ payload }, { call, put }) {
      const response = yield call(codeItemList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getItemDatas',
            payload: response.bcjson,
          });
        }
      }
    },
    *addCodeItem({ payload, callback }, { call, put }) {
      const response = yield call(addCodeItem, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson,
          });
        }
        callback();
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
    getItemDatas(state, action) {
      return {
        ...state,
        itemData: action.payload,
      };
    },
    setDatas(state, action) {
      return {
        ...state,
        obj: action.payload,
      };
    },
  },
};

export default getCodeListModel;
