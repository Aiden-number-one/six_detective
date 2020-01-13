/*
 * @Des: 查询控件相关Modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-11 16:47:21
 */
import _ from 'lodash';
import uuidv1 from 'uuid/v1';
import Service from '@/utils/Service';

const {
  getMetadataTablePerform, // 获取表下的所有字段
  getDataSourceConfig, // 获取所有数据源列表
  getMetadataTableInfo, // 获取数据源列表下的所有table
  getColumnInfo, // 获取table下的所有字段
} = Service;

// import fetch from '@/utils/request.default';
export default {
  namespace: 'formArea',
  state: {
    customSearchData: [], // 查询控件的数据
    dataSourceList: [], // 获取数据源列表
    tableList: [], // 获取数据源表的列表
    tableColumnList: [], // 获取选中表的所有字段
    defaultValueDatasetType: {}, // 若是数据集类型的话，默认值的optionData
  },
  effects: {
    // 获取所有数据源
    *getDataSourceList({ payload }, { call, put }) {
      const response = yield call(getDataSourceConfig, { param: payload });
      let dataSourceList = [];
      if (response.bcjson.flag === '1' && response.bcjson.items.length > 0) {
        dataSourceList = response.bcjson.items;
      }
      yield put({
        type: 'setDataSourceConfig',
        payload: dataSourceList,
      });
    },
    // 获取所有数据源下的所有表
    *getDataSourceTable({ payload }, { call, put }) {
      const response = yield call(getMetadataTableInfo, { param: payload });
      let metadataTableInfo = [];
      if (response.bcjson.flag === '1' && response.bcjson.items.length > 0) {
        metadataTableInfo = response.bcjson.items;
      }
      yield put({
        type: 'setMetadataTableInfo',
        payload: metadataTableInfo,
      });
    },
    // 获取数据源表下的所有字段
    *getTableColumnValue({ payload }, { call, put }) {
      const response = yield call(getColumnInfo, { param: payload });
      let tableColumnList = [];
      if (response.bcjson.flag === '1' && response.bcjson.items.length > 0) {
        tableColumnList = response.bcjson.items;
      }
      yield put({
        type: 'setTableColumnList',
        payload: tableColumnList,
      });
    },
    // 获取数据集下的表的字段的值
    *getDataSetColumnValue({ payload }, { call, put, select }) {
      const response = yield call(getMetadataTablePerform, { param: payload });
      const defaultValueDatasetType = yield select(
        ({ formArea }) => formArea.defaultValueDatasetType,
      );
      const dataSetColumn = {};
      if (response.bcjson.flag === '1' && response.bcjson.items.length > 0) {
        const key = Object.keys(response.bcjson.items[0])[0];
        dataSetColumn[key] = response.bcjson.items.map(item => item[key]);
      }
      yield put({
        type: 'changeDataSetColumn',
        payload: { ...defaultValueDatasetType, ...dataSetColumn },
      });
    },
  },
  reducers: {
    setMetadataTableInfo(state, action) {
      return {
        ...state,
        tableList: action.payload,
      };
    },
    setTableColumnList(state, action) {
      return {
        ...state,
        tableColumnList: action.payload,
      };
    },
    setDataSourceConfig(state, action) {
      return {
        ...state,
        dataSourceList: action.payload,
      };
    },
    changeDataSetColumn(state, action) {
      return {
        ...state,
        defaultValueDatasetType: action.payload,
      };
    },
    setCustomSearchData(state, action) {
      return {
        ...state,
        customSearchData: action.payload,
      };
    },
    addCustomSearchData(state, action) {
      return {
        ...state,
        customSearchData: [...state.customSearchData, action.payload],
      };
    },
    changeAllCustomSearchData(state, action) {
      return {
        ...state,
        customSearchData: action.payload,
      };
    },
    deleteCustomeSearchData(state, action) {
      const index = action.payload;
      const newCustomSearchData = [...state.customSearchData];
      newCustomSearchData.splice(index, 1);
      return {
        ...state,
        customSearchData: newCustomSearchData,
      };
    },
    copyCustomeSearchData(state, action) {
      const index = action.payload;
      const copy = _.cloneDeep(state.customSearchData[index]);
      copy.i = uuidv1();
      copy.x = (state.customSearchData.length * 2) % 12;
      copy.active = false;
      return {
        ...state,
        customSearchData: [...state.customSearchData, copy],
      };
    },
    changeCustomSearchData(state, action) {
      const { props, index } = action.payload;
      const newCustomSearchData = state.customSearchData.map(value => {
        if (value.i === index) {
          return {
            ...value,
            ...props,
            active: true,
          };
        }
        return {
          ...value,
          active: false,
        };
      });
      return {
        ...state,
        customSearchData: newCustomSearchData,
      };
    },
  },
};
