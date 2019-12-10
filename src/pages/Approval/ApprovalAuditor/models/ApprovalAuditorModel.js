import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getProcessAuditor,
  deployedModelList,
  getProcessResource,
  getAlertUserGroup,
  setAuditorConfig,
} = Service;
const ApprovalAuditorModel = {
  namespace: 'ApprovalAuditor',
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
    checkboxData: [],
  },
  effects: {
    *setAuditorConfigDatas({ payload }, { call }) {
      const response = yield call(setAuditorConfig, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('Save successfully');
      } else {
        message.error('Save failed');
      }
    },
    *getQueryMenuDatas({ payload }, { call, put }) {
      const response = yield call(getAlertUserGroup, { param: payload });
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
      const response = yield call(getProcessAuditor, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'auditorlist',
            payload: response.bcjson.items,
          });
        }
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
        processDefinitionId: action.payload.processDefinitionId,
      };
    },
    setMenuDatas(state, action) {
      const menuData = action.payload;
      const checkboxList = menuData.map(item => ({ label: item.roleName, value: item.roleId }));
      return {
        ...state,
        GroupList: menuData,
        checkboxData: checkboxList,
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
export default ApprovalAuditorModel;
