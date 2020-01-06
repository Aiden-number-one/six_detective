/*
 * @Des: 查询控件相关Modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-04 15:26:27
 */

// import fetch from '@/utils/request.default';
export default {
  namespace: 'formArea',
  state: {
    customSearchData: [], // 查询控件的数据
  },
  effects: {},
  reducers: {
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
  },
};
