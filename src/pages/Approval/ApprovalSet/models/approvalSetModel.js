import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getConfig,
  addConfig,
  deleteConfig,
  setConfigStatus,
  getAuditorlist,
  saveConfig,
  deployedModelList,
  getProcessResource,
  getRoleGroup,
  getQueryMenu,
} = Service;
const approvalSetModel = {
  namespace: 'approvalSet',
  state: {
    data: [],
    deployedModelDatas: [],
    processDefinitionId: '',
    processName: '',
    diagramDatas: '',
    processImage: '',
    roleGroupDatas: [],
    auditorData: [],
    GroupList: [],
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
        message.success('保存成功');
        callback({
          pageNumber: '1',
          pageSize: '10',
        });
      } else {
        message.success('保存失败');
      }
    },
    *setConfigStatus({ payload }, { call }) {
      const response = yield call(setConfigStatus, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('修改成功');
      }
    },
    *getRoleGroupDatas({ payload }, { call, put }) {
      const response = yield call(getRoleGroup, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'roleGroupData',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *getQueryMenuDatas({ payload }, { call, put }) {
      const response = yield call(getQueryMenu, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'setMenuDatas',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *getAuditorlistDatas({ payload }, { call, put }) {
      const response = yield call(getAuditorlist, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'auditorlist',
            payload: response.bcjson.items,
          });
        }
      }
    },
    *deployedModelListDatas({ payload, callback }, { call, put }) {
      const response = yield call(deployedModelList, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'deployedModelDatas',
            payload: response.bcjson.items,
          });
          callback(response.bcjson.items[0].processDefinitionId);
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
        processName: action.payload[0].name,
      };
    },
    chooseProcessDefinitionId(state, action) {
      return {
        ...state,
        processDefinitionId: action.payload.processDefinitionId[0],
        processName: action.payload.processDefinitionId[1],
      };
    },
    getDiagram(state, action) {
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
    roleGroupData(state, action) {
      return {
        ...state,
        roleGroupDatas: action.payload,
      };
    },
    setMenuDatas(state, action) {
      const menuData = action.payload[0].MENU;
      return {
        ...state,
        GroupList: menuData,
      };
    },
    auditorlist(state, action) {
      return {
        ...state,
        auditorData: action.payload,
      };
    },
  },
};
export default approvalSetModel;
