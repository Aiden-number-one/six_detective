/*
 * @Des: 查询控件相关Modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-07 22:11:46
 */

// import fetch from '@/utils/request.default';
export default {
  namespace: 'formArea',
  state: {
    customSearchData: [], // 查询控件的数据
  },
  effects: {},
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
    deleteCustomeSearchData(state, action) {
      return {
        ...state,
        customSearchData: action.payload,
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
