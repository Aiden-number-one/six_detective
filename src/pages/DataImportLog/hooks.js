/*
 * @Des: Please Modify First
 * @Author: iron
 * @Email: chenggang@szkingdom.com.cn
 * @Date: 2020-01-17 14:12:08
 * @LastEditors  : iron
 * @LastEditTime : 2020-01-19 17:56:20
 */
import { useState, useEffect } from 'react';
import moment from 'moment';
import { defaultDateRange, downloadFile } from './constants';

export default function useLog({ dispatch, type: logType }) {
  const [dateRange, setDateRange] = useState([]);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    initPage();
  }, []);

  async function initPage() {
    const lastTradeDate = await dispatch({
      type: 'global/fetchLastTradeDate',
    });
    const startDate = lastTradeDate ? moment(lastTradeDate) : defaultDateRange[0];
    const endDate = defaultDateRange[1];

    setDateRange([startDate, endDate]);

    // set defatul query params
    setSearchParams({
      startDate,
      endDate,
    });
    dispatch({
      type: `${logType}/fetch`,
      payload: {
        startDate,
        endDate,
      },
    });
  }

  function handleParams(type, params) {
    setSearchParams(params);
    dispatch({ type, payload: params });
  }

  function handlePageChange(page, pageSize) {
    dispatch({ type: `${logType}/fetch`, payload: { page, pageSize, ...searchParams } });
  }

  async function handleDownload(lopImpId) {
    const reportUrl = await dispatch({
      type: 'lop/fetchReportUrl',
      payload: {
        lopImpId,
      },
    });

    if (reportUrl) {
      downloadFile(reportUrl);
    }
  }

  return {
    dateRange,
    searchParams,
    handleParams,
    handleDownload,
    handlePageChange,
  };
}
