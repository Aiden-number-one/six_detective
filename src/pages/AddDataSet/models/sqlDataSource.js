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
  getDataSourceList, // 获取数据源数据
  getTableData, // 获取数据源表数据
  getMetadataTablePerform, // 数据预览
  getColumn, // 获取列数据
  operateDataSet, // 新增修改数据集
  getDataSetDetail, // 获取单个数据集详情
  getVariableList, // 获取参数
  getProcedure, // 获取存储过程
  getProcStatement, // 获取存储过程参数
} = Service;

export default {
  namespace: 'sqlDataSource',

  state: {
    sqlDataSetName: '', // sql数据集名称,
    activeKey: '', // 数据表列表active
    totalCount: 0, // 数据表列表数量
    metaDataTableList: [], // 数据表列表
    dataSourceList: [], // 数据源配置列表
    connectionId: '', // 选中的数据源ID
    tableData: [], // 数据预览的表格数据
    column: [], // 数据预览的表头
    defaultPageSize: 5, // tableData一页默认展示
    columnData: [], // 列数据
    dataSet: {}, // 数据集详情
    variableList: [], // 参数设置列表
    procedureDataList: [], // 存储过程列表
  },

  effects: {
    // 获取参数
    *getVariableList({ payload, callback }, { call, put }) {
      const res = yield call(getVariableList, { param: payload });
      if (res && res.bcjson.flag === '1') {
        // 参数列表
        yield put({
          type: 'setVariableList',
          payload: res.bcjson.items,
        });
        if (callback) callback(res.bcjson.items);
      }
    },
    // 获取单个数据集
    *getDataSetDetail({ payload, callback }, { call, put }) {
      const res = yield call(getDataSetDetail, { param: payload });
      if (res && res.bcjson.flag === '1') {
        // 保存数据集
        yield put({
          type: 'saveDataSet',
          payload: res.bcjson.items[0],
        });
        if (callback) callback(res.bcjson.items[0]);
      }
    },
    // 新增修改数据集
    *addDataSet({ payload }, { call }) {
      const res = yield call(operateDataSet, { param: payload });
      if (res && res.bcjson.flag === '1') {
        message.success(res.bcjson.msg);
        router.goBack();
      } else {
        message.error(res.bcjson.msg);
      }
    },
    // 获取数据源数据
    *getDataSourceList({ payload }, { call, put }) {
      const { connectionId, datasetType, ...param } = payload;
      const res = yield call(getDataSourceList, { param });
      if (res && res.bcjson.flag === '1') {
        // 保存数据源
        yield put({
          type: 'setDataSourceList',
          payload: res.bcjson.items,
        });
        if (!connectionId) {
          // 修改时选中修改的数据源
          yield put({
            type: 'saveConnectionId',
            payload: {
              connectionId,
            },
          });
        }
        // 清空数据
        yield put({
          type: 'clear',
          payload: [],
        });
        // 获取数据源表
        if (datasetType === 'SQL') {
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
          yield put({
            type: 'getProcedure',
            payload: {
              connectionId:
                connectionId || (res.bcjson.items[0] && res.bcjson.items[0].connectionId),
              objectType: datasetType,
              pageNumber: '1',
              pageSize: '30',
            },
          });
        }
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
        // 懒加载
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
    // 获取数据源下的存储过程
    *getProcedure({ payload }, { call, put, select }) {
      const procedureDataList = yield select(
        ({ sqlDataSource }) => sqlDataSource.procedureDataList,
      );
      const res = yield call(getProcedure, { param: payload });
      if (res && res.bcjson.flag === '1') {
        // 懒加载
        yield put({
          type: 'setProcedureDataList',
          payload: {
            list: [
              ...procedureDataList,
              ...res.bcjson.items.map(value => ({
                id: value.OBJECTNAME,
                name: value.OBJECTNAME,
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
    // 获取存储过程参数
    *getProcStatement({ payload, callback }, { call }) {
      const res = yield call(getProcStatement, { param: payload });
      if (res && res.bcjson.flag === '1') {
        if (callback) callback(res.bcjson.items);
      }
    },
    // 获取表列
    *getColumn({ payload, callback }, { call, put }) {
      const res = yield call(getColumn, { param: payload });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'changeColumnData',
          payload: res.bcjson.items,
        });
        if (callback) callback();
      } else {
        message.error(res.bcjson.msg);
      }
    },
    // 获取表数据
    *getMetadataTablePerform({ payload }, { call, put, select }) {
      const res = yield call(getMetadataTablePerform, { param: payload });
      if (res && res.bcjson.flag === '1') {
        let column = [];
        if (res.bcjson.items[0]) {
          const tableHead = res.bcjson.items[0];
          column = Object.keys(tableHead).map(value => ({
            value,
            // eslint-disable-next-line no-restricted-globals
            type: isNaN(tableHead[value]) ? 'dimension' : 'measure',
            width: 150,
          }));
        } else {
          const columnData = yield select(({ sqlDataSource }) => sqlDataSource.columnData);
          columnData.forEach(item => {
            column.push({
              value: item.field_data_name,
              width: 150,
              type: 'dimension',
            });
          });
        }
        // 保存表头
        yield put({
          type: 'changeColumn',
          payload: column,
        });
        // 保存表数据
        yield put({
          type: 'addMetadataTablePerform',
          payload: res.bcjson.items,
        });
      } else {
        yield put({
          type: 'addMetadataTablePerform',
          payload: [],
        });
        message.error(res.bcjson.msg);
      }
    },
  },

  reducers: {
    // 保存参数list
    setVariableList(state, action) {
      return {
        ...state,
        variableList: action.payload,
      };
    },
    // 修改选中的数据源表
    changeActive(state, action) {
      return {
        ...state,
        activeKey: action.payload,
      };
    },
    // 清空数据源表
    clear(state) {
      return {
        ...state,
        metaDataTableList: [],
        procedureDataList: [],
      };
    },
    // 数据源表
    setDataTableList(state, { payload: { list, totalCount } }) {
      return {
        ...state,
        metaDataTableList: list,
        totalCount,
      };
    },
    // 存储过程
    setProcedureDataList(state, { payload: { list, totalCount } }) {
      return {
        ...state,
        procedureDataList: list,
        totalCount,
      };
    },
    // 存储过程参数 setProcStatement
    // setProcStatement(state, action) {
    //   return {
    //     ...state,
    //     procStatement: action.payload,
    //   };
    // },
    // 数据源列表
    setDataSourceList(state, action) {
      return {
        ...state,
        dataSourceList: action.payload,
      };
    },
    // 保存选中的数据源ID
    saveConnectionId(state, action) {
      return {
        ...state,
        connectionId: action.payload.connectionId,
      };
    },
    // 数据预览表头
    changeColumn(state, action) {
      return {
        ...state,
        column: action.payload,
      };
    },
    // 数据预览表格数据
    addMetadataTablePerform(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    // 清空数据预览数据
    clearMetadata(state) {
      return {
        ...state,
        tableData: [],
        column: [],
      };
    },
    // 数据集名称
    changeDataSetName(state, action) {
      return {
        ...state,
        sqlDataSetName: action.payload,
      };
    },
    // 改变默认一页显示行数
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
    // 数据集详情
    saveDataSet(state, action) {
      return {
        ...state,
        dataSet: action.payload,
      };
    },
    // 初始化
    clearAll() {
      return {
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
        dataSet: {},
        variableList: [],
      };
    },
  },
};
