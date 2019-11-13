import Service from '@/utils/Service';
import { formatTree } from '@/utils/utils';

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
        // let newItems = 1;
        // newItems = formatTree(response.bcjson.items, '', '');
        let newItmes = [];
        yield (newItmes = formatTree(response.bcjson.items, 'folderId', 'parentId'));
        yield (response.bcjson.items = newItmes);
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
