import { message } from 'antd';
import Service from '@/utils/Service';

const { getConfig, saveConfig, deployedModelList } = Service;
const approvalConfigurationModel = {
  namespace: 'approvalConfiguration',
  state: {
    data: [],
    totalCount: 0,
    deployedModelDatas: [],
    processName: '',
  },
  effects: {
    *approvalConfigDatas({ payload }, { call, put }) {
      const response = yield call(getConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setDatas',
            payload: { totalCount: response.bcjson.totalCount, data: response.bcjson.items },
          });
        }
      }
    },
    *saveConfigDatas({ payload, callback }, { call }) {
      const response = yield call(saveConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('Save successfully');
        callback({
          pageNumber: '1',
          pageSize: '10',
        });
      } else {
        message.error('Save failed');
      }
    },
    *deployedModelListDatas({ payload }, { call, put }) {
      const response = yield call(deployedModelList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'deployedModelDatas',
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
        data: action.payload.data,
        totalCount: action.payload.totalCount,
      };
    },
    deployedModelDatas(state, action) {
      return {
        ...state,
        deployedModelDatas: action.payload,
        processDefinitionId: action.payload[0].processDefinitionId,
        processName: action.payload[0].name,
      };
    },
  },
};
export default approvalConfigurationModel;
