/*
 * @Description: 获取数据源列表
 * @Author: lan
 * @Date: 2019-11-07 17:42:09
 * @LastEditTime: 2019-11-15 17:40:27
 * @LastEditors: lan
 */
import Service from '@/utils/Service';

const { getDataSourceList, getDataDriver, setDataSource, updDataSource, delDataSource } = Service;

export default {
  namespace: 'dataSource',
  state: {
    activeData: {},
    dataSourceList: [],
    activeCID: '',
    driverInfo: [],
    activeDriver: {},
  },
  effects: {
    // 获取数据源列表
    *getDataSourceList({ payload, callback }, { call, put }) {
      const response = yield call(getDataSourceList, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存数据源信息
        yield put({
          type: 'setDataSourceList',
          payload: response.bcjson.items,
        });
        if (response.bcjson.items[0]) {
          // 默认选中第一个
          yield put({
            type: 'setActiveCID',
            payload: response.bcjson.items[0].connectionId,
          });
          if (callback) callback(response);
        }
      }
    },
    // 新建数据源
    *setDatasource({ payload }, { call, put }) {
      const response = yield call(setDataSource, { param: payload });
      if (response.bcjson.flag === '1') {
        // 刷新数据源列表
        yield put({
          type: 'getDataSourceList',
          payload: {},
        });
      }
    },
    // 更新数据源
    *updDataSource({ payload }, { call, put }) {
      const response = yield call(updDataSource, { param: payload });
      if (response.bcjson.flag === '1') {
        // 刷新数据源列表
        yield put({
          type: 'getDataSourceList',
          payload: {},
        });
      }
    },
    // 删除数据源
    *delDataSource({ payload }, { call, put }) {
      const response = yield call(delDataSource, { param: payload });
      if (response.bcjson.flag === '1') {
        // 刷新数据源列表
        yield put({
          type: 'getDataSourceList',
          payload: {},
        });
      }
    },
    // 获取驱动列表
    *getDataDriver({ payload }, { call, put }) {
      const response = yield call(getDataDriver, { param: payload });
      if (response.bcjson.flag === '1') {
        // 保存驱动信息
        yield put({
          type: 'saveDriverInfo',
          payload: response.bcjson.items,
        });
      }
    },
  },
  reducers: {
    // 编辑数据源时数据源信息
    saveDate(state, action) {
      return {
        ...state,
        activeData: action.payload,
      };
    },
    // 保存数据源列表信息
    setDataSourceList(state, action) {
      return {
        ...state,
        dataSourceList: action.payload,
      };
    },
    // 保存被点击的数据源的ID
    setActiveCID(state, action) {
      return {
        ...state,
        activeCID: action.payload,
      };
    },
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
  },
};
