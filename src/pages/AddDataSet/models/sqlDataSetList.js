/*
 * @Author: Sean Mu
 * @Date: 2019-05-29 13:45:52
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-06-25 14:00:43
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const { getDataSourceList, getTableData } = Service;

export default {
  namespace: 'sqlDataSetList',

  state: {
    activeKey: '', // 数据表列表active
    totalCount: 0, // 数据表列表数量
    metaDataTableList: [], // 数据表列表
    dataSourceList: [], // 数据源配置列表
    connectionId: '', //
  },

  effects: {
    *getDataSourceConfig({ payload }, { call, put }) {
      const { connectionId, ...param } = payload;
      const res = yield call(getDataSourceList, { param });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'setDataSourceList',
          payload: res.bcjson.items,
        });

        yield put({
          type: 'clear',
          payload: [],
        });
        yield put({
          type: 'getMetadataTableInfo',
          payload: {
            connection_id:
              connectionId || (res.bcjson.items[0] && res.bcjson.items[0].connectionId),
            pageNumber: '1',
            pageSize: '30',
            ignoreMdType: 'U',
          },
        });
      } else {
        message.error(res.bcjson.msg.substring(0, 1000));
      }
    },
    *getMetadataTableInfo({ payload }, { call, put, select }) {
      const metaDataTableList = yield select(
        ({ sqlDataSetList }) => sqlDataSetList.metaDataTableList,
      );
      const res = yield call(getTableData, { param: payload });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'setDataTableList',
          payload: {
            list: [
              ...metaDataTableList,
              ...res.bcjson.items.map(value => ({
                id: value.tableId,
                name: `${value.schemName}.${value.tableName}`,
                icon: 'iconbianjiqi_charubiaoge',
                otherInfo: value,
              })),
            ],
            totalCount: res.bcjson.totalCount,
          },
        });
      } else {
        message.error(res.bcjson.msg.substring(0, 1000));
      }
    },
  },

  reducers: {
    changeActive(state, action) {
      return {
        ...state,
        activeKey: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        metaDataTableList: [],
      };
    },
    setDataTableList(state, { payload: { list, totalCount } }) {
      return {
        ...state,
        metaDataTableList: list,
        totalCount,
      };
    },
    setDataSourceList(state, action) {
      return {
        ...state,
        dataSourceList: action.payload,
      };
    },
    saveConnectionId(state, action) {
      return {
        ...state,
        connectionId: action.payload.connectionId,
      };
    },
  },
};
