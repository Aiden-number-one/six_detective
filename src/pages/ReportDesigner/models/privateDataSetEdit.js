/*
 * @Des: 编辑数据集的相关modal
 * @Author: mus
 * @Email: mus@szkingdom.com
 * @Date: 2019-12-05 09:43:41
 * @LastEditors  : mus
 * @LastEditTime : 2020-01-04 15:26:49
 */

import { createCellPos } from '@/utils/utils';
import Service from '@/utils/Service';

const {
  sqlFormated, // sql美化
  // getVariableList, // 获取参数
} = Service;

export default {
  namespace: 'privateDataSet',
  state: {
    customSearchData: [], // 查询控件的数据
    cellPosition: 'A1',
  },
  effects: {
    *sqlFormated({ payload }, { call, put }) {
      const res = yield call(sqlFormated, { param: payload });
      if (res && res.bcjson.flag === '1') {
        yield put({
          type: 'changeSql',
          payload: res.bcjson.items[0].formatedContent,
        });
      }
    },
  },
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
