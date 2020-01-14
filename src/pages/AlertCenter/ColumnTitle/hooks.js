/*
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2020-01-13 15:52:48
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-14 10:03:35
 */
import { useState } from 'react';

export function useColumnFilter({ dispatch, action: type, alertPage, alertPageSize, reset }) {
  // { column: '', value: '', condition: '7' }
  const [conditions, setConditions] = useState([]);
  const [curTableColumn, setCurTableColumn] = useState('');
  const [curSortColumn, setCurSortColumn] = useState('');
  const [curSort, setCurSort] = useState('');

  // filter methods
  async function handleCommit(tableColumn, updatedConditions = []) {
    setCurTableColumn(tableColumn);
    setConditions(updatedConditions);
    if (reset) {
      reset();
    }
    dispatch({
      type,
      payload: {
        currentColumn: tableColumn,
        conditions: updatedConditions,
        page: alertPage,
        pageSize: alertPageSize,
        sort: curSortColumn === tableColumn ? curSort : '',
      },
    });
  }

  async function handleSort(tableColumn, sort) {
    setCurTableColumn(tableColumn);
    setCurSortColumn(tableColumn);
    setCurSort(sort);
    if (reset) {
      reset();
    }
    dispatch({
      type: 'alertCenter/fetch',
      payload: {
        currentColumn: tableColumn,
        conditions,
        page: alertPage,
        pageSize: alertPageSize,
        sort,
      },
    });
  }

  return {
    conditions,
    curTableColumn,
    curSortColumn,
    curSort,
    handleCommit,
    handleSort,
  };
}
