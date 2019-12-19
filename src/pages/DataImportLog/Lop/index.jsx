import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi/locale';
import { yesterday, today } from '../constants';
import LopLogFilterForm from './LopLogFilterForm';
import LopLogList from './LopLogList';
import LopLogManualModal from './LopLogManualModal';
import styles from '../index.less';

const format = 'YYYYMMDD';

const aLink = document.createElement('a');
aLink.download = true;

export function LopLog({ dispatch, loading, logs, total, reportUrl }) {
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    dispatch({
      type: 'lop/fetch',
      payload: {
        startTradeDate: yesterday.format(format),
        endTradeDate: today.format(format),
      },
    });
  }, []);

  function handleSearch(params) {
    setSearchParams(params);
    dispatch({ type: 'lop/reload', payload: params });
  }

  function handlePageChange(page, pageSize) {
    dispatch({ type: 'lop/reload', payload: { page, pageSize, ...searchParams } });
  }
  async function handleUpload(params) {
    await dispatch({ type: 'lop/importByManual', payload: params });
    setVisible(false);
  }
  async function handleDownload(lopImpId) {
    await dispatch({
      type: 'lop/fetchReportUrl',
      payload: {
        lopImpId,
      },
    });
    aLink.href = `/download?filePath=${reportUrl}`;
    aLink.click();
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <LopLogFilterForm handleSearch={handleSearch} />
        <LopLogManualModal
          visible={visible}
          handleCancel={() => setVisible(false)}
          handleUpload={handleUpload}
        />
        <div className={styles['list-wrap']}>
          <Row className={styles['btn-group']}>
            <Button
              type="primary"
              onClick={() => dispatch({ type: 'lop/importByAuto' })}
              loading={loading['lop/importByAuto']}
            >
              <FormattedMessage id="data-import.execute" />
            </Button>
            <Button type="primary" className={styles['no-margin']} onClick={() => setVisible(true)}>
              <FormattedMessage id="data-import.manual-import" />
            </Button>
          </Row>
          <LopLogList
            total={total}
            dataSource={logs}
            loading={loading}
            reportUrl={reportUrl}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageChange}
            handleDownload={handleDownload}
          />
        </div>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ loading, lop: { logs, page, total, reportUrl } }) => ({
  loading: loading.effects,
  logs,
  page,
  total,
  reportUrl,
}))(LopLog);
