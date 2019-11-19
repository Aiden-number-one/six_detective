/*
 * @Description: 驱动信息
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime: 2019-11-19 17:38:34
 * @LastEditors: lan
 */
// import { message } from 'antd';
import Service from '@/utils/Service';

const {
  getDataDriver, // 获取驱动
  getDict, // 获取字典
} = Service;

export default {
  namespace: 'driverInfo',
  state: {
    databaseType: {}, // 资源类型字典
    category: {}, // 驱动类型字典
    driverInfo: [],
    activeDriver: {},
  },
  effects: {
    // 获取资源类型字典
    *getDataBaseType({ payload }, { call, put }) {
      const response = yield call(getDict, { param: payload })
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items[0]) {
          yield put({
            type: 'saveDataBaseType',
            payload: response.bcjson.items[0].DATABASETYPE,
          })
        }
        // Object.values(databaseType)
      }
    },
    // 获取驱动类型字典
    *getCategory({ payload }, { call, put }) {
      const response = yield call(getDict, { param: payload })
      if (response.bcjson.flag === '1') {
        if (response.bcjson.items[0]) {
          yield put({
            type: 'saveCategory',
            payload: response.bcjson.items[0].CATEGORY,
          })
        }
        // Object.values(databaseType)
      }
    },
    // 获取驱动列表
    *getDataDriver({ payload, callback }, { call, put }) {
      const response = yield call(getDataDriver, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存驱动信息
        yield put({
          type: 'saveDriverInfo',
          payload: response.bcjson.items,
        });
        if (response.bcjson.items[0]) {
          callback(response);
        }
      }
    },
  },
  reducers: {
    // 保存驱动信息
    saveDriverInfo(state, action) {
      return {
        ...state,
        driverInfo: action.payload,
      };
    },
    // 选中的驱动信息
    setActiveDriver(state, action) {
      return {
        ...state,
        activeDriver: action.payload,
      };
    },
    // 保存资源类型字典
    saveDataBaseType(state, action) {
      return {
        ...state,
        databaseType: action.payload,
      };
    },
    // 保存驱动类型字典
    saveCategory(state, action) {
      return {
        ...state,
        category: action.payload,
      };
    },
  },
};
