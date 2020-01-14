/*
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2020-01-13 15:52:48
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-14 22:00:36
 */
import { useState, useEffect } from 'react';

export const actionType = 'global/fetchTableList';

export function useColumnFilter({
  dispatch,
  page,
  pageSize,
  reset,
  tableName = 'SLOP_BIZ.V_ALERT_CENTER',
}) {
  // { column: '', value: '', condition: '7' }
  const [conditions, setConditions] = useState([]);
  const [curTableColumn, setCurTableColumn] = useState('');
  const [curSortColumn, setCurSortColumn] = useState('');
  const [curSort, setCurSort] = useState('');

  // reset state
  useEffect(() => {
    setConditions([]);
    setCurTableColumn('');
    setCurSortColumn('');
    setCurSort('');
  }, [tableName]);

  function fetchTableList(params = {}, dataTable = tableName) {
    dispatch({
      type: actionType,
      payload: {
        ...params,
        dataTable,
      },
    });
  }

  // filter methods
  async function handleCommit(tableColumn, updatedConditions = []) {
    setCurTableColumn(tableColumn);
    setConditions(updatedConditions);
    if (reset) {
      reset();
    }
    fetchTableList({
      page,
      pageSize,
      currentColumn: tableColumn,
      conditions: updatedConditions,
      sort: curSortColumn === tableColumn ? curSort : '',
    });
  }

  async function handleSort(tableColumn, sort) {
    setCurTableColumn(tableColumn);
    setCurSortColumn(tableColumn);
    setCurSort(sort);
    if (reset) {
      reset();
    }
    fetchTableList({
      sort,
      page,
      pageSize,
      conditions,
      currentColumn: tableColumn,
    });
  }

  async function handlePageChange(p, ps) {
    fetchTableList({
      page: p,
      pageSize: ps,
      conditions,
      currentColumn: curTableColumn,
      sort: curSortColumn === curTableColumn ? curSort : '',
    });
  }

  return {
    fetchTableList,
    handlePageChange,
    getTitleProps: (column = curTableColumn) => ({
      curColumn: column,
      conditions,
      tableName,
      sort: curSortColumn === column ? curSort : '',
      onCommit: handleCommit,
      onSort: handleSort,
    }),
  };
}
