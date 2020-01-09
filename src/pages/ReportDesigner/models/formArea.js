/*
 * @Des: 查询控件相关Modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-08 21:19:06
 */
import _ from 'lodash';
import uuidv1 from 'uuid/v1';

// import fetch from '@/utils/request.default';
export default {
  namespace: 'formArea',
  state: {
    customSearchData: [], // 查询控件的数据
    datasourceList: [], // 获取数据源列表
    tableList: [], // 获取数据源表的列表
    tableColumnList: [], // 获取选中表的所有字段
  },
  effects: {
    // 获取所有数据源
    // 获取所有数据源下的所有表
    // 获取数据源表下的所有字段
  },
  reducers: {
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
