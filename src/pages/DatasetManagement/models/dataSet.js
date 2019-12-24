/*
 * @Description: 获取数据集列表
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime : 2019-12-23 10:33:00
 * @LastEditors  : lan
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getClassifyTree,
  getDataSet,
  setSqlClassify,
  deleteSqlClassify,
  getMetadataTablePerform,
  operateDataSet,
} = Service;

export default {
  namespace: 'dataSet',
  state: {
    classifyTreeData: [], // 树列表
    dataSetData: [], // 数据集
    column: [], // 数据预览表头
    tableData: [], // 数据预览数据
    activeTree: '', // 选中的树
    activeFolderId: '',
  },
  effects: {
    // 获取数据集分类树
    *getClassifyTree({ payload, callback }, { call, put }) {
      const response = yield call(getClassifyTree, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据集分类树
        yield put({
          type: 'setClassifyTreeData',
          payload: response.bcjson.items,
        });
        if (response.bcjson.items[0]) {
          // 默认选中第一个
          yield put({
            type: 'getDataSet',
            payload: {
              folderId: response.bcjson.items[0].classId,
            },
          });
          if (callback) callback(response);
        }
      }
    },
    // 操作数据集分类树
    *operateClassifyTree({ payload }, { call, put }) {
      const response = yield call(setSqlClassify, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据集分类树
        yield put({
          type: 'getClassifyTree',
          payload: {},
        });
      }
    },
    // 删除数据集分类树
    *deleteClassifyTree({ payload }, { call, put }) {
      const response = yield call(deleteSqlClassify, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据集分类树
        yield put({
          type: 'getClassifyTree',
          payload: {},
        });
      }
    },
    // 获取数据集
    *getDataSet({ payload }, { call, put }) {
      const response = yield call(getDataSet, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据集
        yield put({
          type: 'saveDataSetData',
          payload: response.bcjson.items,
        });
      }
    },
    // 获取表数据
    *getMetadataTablePerform({ payload, callback }, { call, put }) {
      const res = yield call(getMetadataTablePerform, { param: payload });
      if (res && res.bcjson.flag === '1') {
        const tableHead = res.bcjson.items[0] ? res.bcjson.items[0] : {};
        const column = Object.keys(tableHead).map(value => ({
          value,
          // eslint-disable-next-line no-restricted-globals
          type: isNaN(tableHead[value]) ? 'dimension' : 'measure',
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
      if (callback) callback();
    },
    // 操作数据集
    *operateDataSet({ payload }, { call, put, select }) {
      const classId = yield select(({ dataSet }) => dataSet.activeTree);
      const res = yield call(operateDataSet, { param: payload });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'getDataSet',
          payload: {
            folderId: classId,
          },
        });
      } else {
        message.error(res.bcjson.msg);
      }
    },
  },
  reducers: {
    setClassifyTreeData(state, action) {
      return {
        ...state,
        classifyTreeData: action.payload,
      };
    },
    saveDataSetData(state, action) {
      return {
        ...state,
        dataSetData: action.payload,
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
    setActiveTree(state, action) {
      return {
        ...state,
        activeTree: action.payload,
      };
    },
    saveFolderId(state, action) {
      return {
        ...state,
        activeFolderId: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        column: [], // 数据预览表头
        tableData: [], // 数据预览数据
      };
    },
  },
};
