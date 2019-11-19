import { message } from 'antd';
import Service from '@/utils/Service';
import { formatTree } from '@/utils/utils';

const { getSchedule, scheduleDelete, scheduleModify, scheduleAdd, getFolderMenu } = Service;

const scheduleModel = {
  namespace: 'schedule',
  state: {
    scheduleList: [],
    folderMenuDatas: '',
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
    *deleteScheduleBatch({ payload, callback }, { call }) {
      const response = yield call(scheduleDelete, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('删除成功');
        callback();
      }
    },
    *modifyScheduleBatch({ payload, callback }, { call }) {
      const response = yield call(scheduleModify, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('修改成功');
        callback();
      }
    },
    *addScheduleBatch({ payload, callback }, { call }) {
      const response = yield call(scheduleAdd, { param: payload });
      if (response.bcjson.flag === '1') {
        message.success('新增成功');
        callback();
      }
    },
    *getFolderMenuList({ payload }, { call, put }) {
      const response = yield call(getFolderMenu, { param: payload });
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items) {
          yield put({
            type: 'getFolderMenuDatas',
            payload: response.bcjson.items,
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
    getFolderMenuDatas(state, action) {
      return {
        ...state,
        folderMenuDatas: formatTree(action.payload, 'folderId', 'parentId'),
      };
    },
  },
};

export default scheduleModel;
