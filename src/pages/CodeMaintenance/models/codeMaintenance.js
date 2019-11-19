import Service from '@/utils/Service';

const { codeList, codeItemList, addCodeItem, updateCodeItem, deleteCodeItem } = Service;
const codeMaintenance = {
  namespace: 'codeList',
  state: {
    data: [],
    itemData: [],
    obj: {},
    objUpdate: {},
    objDelete: {},
  },
  effects: {
    *getCodeList({ payload, callback }, { call, put }) {
      const response = yield call(codeList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDatas',
            payload: response.bcjson,
          });
        }
        callback();
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
    *updateCodeItem({ payload, callback }, { call, put }) {
      const response = yield call(updateCodeItem, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson) {
          yield put({
            type: 'updateDatas',
            payload: response.bcjson,
          });
        }
        callback();
      }
    },
    *deleteCodeItem({ payload, callback }, { call, put }) {
      const response = yield call(deleteCodeItem, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson) {
          yield put({
            type: 'deleteDatas',
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
    updateDatas(state, action) {
      return {
        ...state,
        objUpdate: action.payload,
      };
    },
    deleteDatas(state, action) {
      return {
        ...state,
        objDelete: action.payload,
      };
    },
  },
};

export default codeMaintenance;
