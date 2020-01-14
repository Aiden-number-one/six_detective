/*
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2020-01-13 15:52:48
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-14 14:41:13
 */
import { useState } from 'react';

export function useColumnFilter({ dispatch, tableName, action: type, page, pageSize, reset }) {
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
        page,
        pageSize,
        currentColumn: tableColumn,
        conditions: updatedConditions,
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
        page,
        pageSize,
        sort,
      },
    });
  }

  async function handlePageChange(p, ps) {
    dispatch({
      type: 'alertCenter/fetch',
      payload: {
        page: p,
        pageSize: ps,
        conditions,
        currentColumn: curTableColumn,
        sort: curSortColumn === curTableColumn ? curSort : '',
      },
    });
  }

  return {
    handlePageChange,
    getTitleProps: column => ({
      curColumn: column,
      conditions,
      tableName,
      sort: curSortColumn === column ? curSort : '',
      onCommit: handleCommit,
      onSort: handleSort,
    }),
  };
}
