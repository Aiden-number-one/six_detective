import Service from '@/utils/Service';

const {
  getConfig,
  addConfig,
  deleteConfig,
  saveConfig,
  deployedModelList,
  getDiagram,
  getProcessResource,
} = Service;
const approvalSetModel = {
  namespace: 'approvalSet',
  state: {
    data: [],
    deployedModelDatas: [],
    processDefinitionId: '',
    diagramDatas: '',
    processImage: '',
  },
  effects: {
    *approvalConfigDatas({ payload }, { call, put }) {
      const response = yield call(getConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *addConfigDatas({ payload, callback }, { call }) {
      const response = yield call(addConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        callback({
          pageNumber: '1',
          pageSize: '10',
        });
      }
    },
    *deleteConfigDatas({ payload, callback }, { call }) {
      const response = yield call(deleteConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        callback({
          pageNumber: '1',
          pageSize: '10',
        });
        // if (response.bcjson.items) {
        //   yield put({
        //     type: 'setDatas',
        //     payload: response.bcjson.items,
        //   });
        // }
      }
    },
    *saveConfigDatas({ payload, callback }, { call }) {
      const response = yield call(saveConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        callback({
          pageNumber: '1',
          pageSize: '10',
        });
      }
    },
    *deployedModelListDatas({ payload, callback, callback2 }, { call, put }) {
      const response = yield call(deployedModelList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'deployedModelDatas',
            payload: response.bcjson.items,
          });
          callback(response.bcjson.items[0].processDefinitionId);
          callback2(response.bcjson.items[0].processDefinitionId);
        }
      }
    },
    *getDiagramDatas({ payload }, { call, put }) {
      const response = yield call(getDiagram, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getDiagramDatas',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *getProcessResourceDatas({ payload }, { call, put }) {
      const response = yield call(getProcessResource, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getImageUrl',
            payload: response.bcjson.items,
          });
        }
      }
    },
  },
  reducers: {
    setDatas(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    deployedModelDatas(state, action) {
      return {
        ...state,
        deployedModelDatas: action.payload,
        processDefinitionId: action.payload[0].processDefinitionId,
      };
    },
    chooseProcessDefinitionId(state, action) {
      return {
        ...state,
        processDefinitionId: action.payload.processDefinitionId,
      };
    },
    getDiagramDatas(state, action) {
      return {
        ...state,
        diagramDatas: action.payload,
      };
    },
    getImageUrl(state, action) {
      return {
        ...state,
        processImage: action.payload,
      };
    },
  },
};
export default approvalSetModel;
