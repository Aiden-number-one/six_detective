/*
 * @Des: 查询控件相关Modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors: mus
 * @LastEditTime: 2019-12-05 11:24:49
 */

import fetch from '@/utils/request.default';

export default {
  namespace: 'formArea',
  state: {
    customSearchData: [{}], // 查询控件的数据
  },
  effects: {},
  reducers: {
    changeCustomSearchData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
