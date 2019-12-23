/*
 * @Author: Sean Mu
 * @Date: 2019-05-29 13:45:52
 * @Last Modified by: lanjianyan
 * @Last Modified time: 2019-06-25 14:00:43
 */
import { message } from 'antd';
import router from 'umi/router';
import Service from '@/utils/Service';

const {
  getDataSourceList,
  getTableData,
  getMetadataTablePerform,
  getColumn,
  operateDataSet,
} = Service;

export default {
  namespace: 'sqlDataSource',

  state: {
    sqlDataSetName: '', // sql数据集名称,
    activeKey: '', // 数据表列表active
    totalCount: 0, // 数据表列表数量
    metaDataTableList: [], // 数据表列表
    dataSourceList: [], // 数据源配置列表
    connectionId: '', //
    tableData: [], //
    column: [], // table的column
    defaultPageSize: 5, // tableData一页默认展示
    columnData: [],
  },

  effects: {
    *addDataSet({ payload }, { call }) {
      const res = yield call(operateDataSet, { param: payload });
      if (res && res.bcjson.flag === '1') {
        message.success(res.bcjson.msg);
        router.goBack();
      }
    },
    // 获取数据源数据
    *getDataSourceList({ payload }, { call, put }) {
      const { connectionId, ...param } = payload;
      const res = yield call(getDataSourceList, { param });
      if (res && res.bcjson.flag === '1') {
        // 保存数据源
        yield put({
          type: 'setDataSourceList',
          payload: res.bcjson.items,
        });

        yield put({
          type: 'clear',
          payload: [],
        });
        yield put({
          type: 'getMetadataList',
          payload: {
            connection_id:
              connectionId || (res.bcjson.items[0] && res.bcjson.items[0].connectionId),
            pageNumber: '1',
            pageSize: '30',
          },
        });
      } else {
        message.error(res.bcjson.msg.substring(0, 1000));
      }
    },
    // 获取数据源下的表
    *getMetadataList({ payload }, { call, put, select }) {
      const metaDataTableList = yield select(
        ({ sqlDataSource }) => sqlDataSource.metaDataTableList,
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
    // 获取表列
    *getColumn({ payload }, { call, put }) {
      const res = yield call(getColumn, { param: payload });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'changeColumnData',
          payload: res.bcjson.items,
        });
      }
    },
    // 获取表数据
    *getMetadataTablePerform({ payload }, { call, put }) {
      const res = yield call(getMetadataTablePerform, { param: payload });
      if (res && res.bcjson.flag === '1') {
        const tableHead = res.bcjson.items[0] ? res.bcjson.items[0] : {};
        const column = Object.keys(tableHead).map(value => ({
          value,
          // eslint-disable-next-line no-restricted-globals
          type: isNaN(tableHead[value]) ? 'dimension' : 'measure',
          width: 150,
        }));
        yield put({
          type: 'changeColumn',
          payload: column,
        });
        yield put({
          type: 'addMetadataTablePerform',
          payload: res.bcjson.items,
        });
      } else {
        yield put({
          type: 'addMetadataTablePerform',
          payload: [],
        });
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
    changeColumn(state, action) {
      return {
        ...state,
        column: action.payload,
      };
    },
    addMetadataTablePerform(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    clearMetadata(state) {
      return {
        ...state,
        tableData: [],
        column: [],
      };
    },
    changeDataSetName(state, action) {
      return {
        ...state,
        sqlDataSetName: action.payload,
      };
    },
    changeDefaultPageSize(state, { payload }) {
      return {
        ...state,
        defaultPageSize: payload,
      };
    },
    // 列数据
    changeColumnData(state, action) {
      return {
        ...state,
        columnData: action.payload,
      };
    },
  },
};
