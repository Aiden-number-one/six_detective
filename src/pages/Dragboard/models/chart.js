/*
 * @Description: sheet model
 * @Author: mus
 * @Date: 2019-09-23 17:41:22
 * @LastEditTime: 2019-10-17 17:54:02
 * @LastEditors: lan
 * @Email: mus@szkingdom.com
 */
const Model = {
  namespace: 'chart',
  state: {
    charts: [],
  },
  effects: {},
  reducers: {
    addChart(state, action) {
      return {
        ...state,
        charts: [...state.charts, action.payload],
      };
    },
  },
};
export default Model;
