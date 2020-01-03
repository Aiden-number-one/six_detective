/*
 * @Description: 获取数据集列表
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime : 2020-01-03 17:17:36
 * @LastEditors  : lan
 */
import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getClassifyTree, // 获取数据集分类文件夹
  getDataSet, // 获取数据集列表
  setSqlClassify, // 新增修改数据集分类文件夹
  deleteSqlClassify, // 删除数据集分类文件夹
  getMetadataTablePerform, // 数据预览
  operateDataSet, // 删除移动数据集
} = Service;

export default {
  namespace: 'dataSet',
  state: {
    classifyTreeData: [], // 树列表
    dataSetData: [], // 数据集
    column: [], // 数据预览表头
    tableData: [], // 数据预览数据
    activeTree: '', // 选中的树
    activeFolderId: '', // 移动文件夹选中的树
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
          payload: {
            dataStyle: 'Y',
            fileType: payload.fileType,
          },
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
          payload: {
            dataStyle: 'Y',
            fileType: payload.fileType,
          },
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
        // 处理数据生成表头
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
        // 重新获取数据集
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
    // 保存数据集分类文件夹
    setClassifyTreeData(state, action) {
      return {
        ...state,
        classifyTreeData: action.payload,
      };
    },
    // 保存数据集列表
    saveDataSetData(state, action) {
      return {
        ...state,
        dataSetData: action.payload,
      };
    },
    // 保存数据预览表格表头
    changeColumn(state, action) {
      return {
        ...state,
        column: action.payload,
      };
    },
    // 保存数据预览表格数据
    addMetadataTablePerform(state, action) {
      return {
        ...state,
        tableData: action.payload,
      };
    },
    // 选中左侧的树
    setActiveTree(state, action) {
      return {
        ...state,
        activeTree: action.payload,
      };
    },
    // 选中移动文件夹的树
    saveFolderId(state, action) {
      return {
        ...state,
        activeFolderId: action.payload,
      };
    },
    // 清空数据预览数据
    clear(state) {
      return {
        ...state,
        column: [], // 数据预览表头
        tableData: [], // 数据预览数据
      };
    },
  },
};
