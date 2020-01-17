import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi/locale';
import { defaultDateRange, downloadFile } from '../constants';
import FilterForm from '../FilterForm';
import LopLogList from './LopLogList';
import LopLogManualModal from './LopLogManualModal';
import styles from '../index.less';

export function LopLog({ dispatch, loading, page: current, logs, total }) {
  const [visible, setVisible] = useState(false);
  const [dateRange, setdateRange] = useState([]);
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

    setdateRange([startDate, endDate]);

    dispatch({
      type: 'lop/fetch',
      payload: {
        startDate: dateRange[0],
        endDate: dateRange[1],
      },
    });
  }

  async function getSubmitters(params) {
    return dispatch({
      type: 'lop/fetchSubmitters',
      payload: params,
    });
  }

  function handleParams(type, params) {
    setSearchParams(params);
    dispatch({ type, payload: params });
  }

  function handlePageChange(page, pageSize) {
    dispatch({ type: 'lop/fetch', payload: { page, pageSize, ...searchParams } });
  }

  async function handleUpload(params) {
    await dispatch({
      type: 'lop/importByManual',
      payload: {
        searchParams,
        ...params,
      },
    });
    setVisible(false);
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

  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <FilterForm
          formType={0}
          loading={loading}
          onParams={handleParams}
          defaultDateRange={dateRange}
        />
        <LopLogManualModal
          visible={visible}
          loading={loading}
          onSubmitter={getSubmitters}
          onCancel={() => setVisible(false)}
          onUpload={handleUpload}
        />
        <div className={styles['list-wrap']}>
          <Row className={styles['btn-group']}>
            <Button type="primary" className={styles['no-margin']} onClick={() => setVisible(true)}>
              <FormattedMessage id="data-import.manual-import" />
            </Button>
          </Row>
          <LopLogList
            dataSource={logs}
            page={current}
            total={total}
            loading={loading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageChange}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ loading, lop: { logs, page, total } }) => ({
  loading: loading.effects,
  logs,
  page,
  total,
}))(LopLog);
