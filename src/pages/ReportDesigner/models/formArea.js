/*
 * @Des: 查询控件相关Modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors  : mus
 * @LastEditTime : 2019-12-18 14:24:08
 */

// import fetch from '@/utils/request.default';
import { createCellPos } from '@/utils/utils';

export default {
  namespace: 'formArea',
  state: {
    customSearchData: [], // 查询控件的数据
    cellPosition: 'A1',
  },
  effects: {},
  reducers: {
    changeCustomSearchData(state, action) {
      return {
        ...state,
        customSearchData: action.payload,
      };
    },
    deleteCustomeSearchData(state, action) {
      return {
        ...state,
        customSearchData: action.payload,
      };
    },
    changeCellPosition(state, action) {
      const { rowIndex, columnIndex } = action.payload;
      const cellPosition = createCellPos(columnIndex) + (rowIndex + 1);
      return {
        ...state,
        cellPosition,
      };
    },
  },
};
