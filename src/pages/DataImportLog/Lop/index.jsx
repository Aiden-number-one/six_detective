import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi/locale';
import LopLogFilterForm, { defaultTradeDate } from './LopLogFilterForm';
import LopLogList from './LopLogList';
import LopLogManualModal from './LopLogManualModal';
import styles from '../index.less';

const aLink = document.createElement('a');
aLink.download = true;

export function LopLog({ dispatch, loading, logs, total }) {
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    startTradeDate: defaultTradeDate[0],
    endTradeDate: defaultTradeDate[1],
  });

  useEffect(() => {
    dispatch({
      type: 'lop/fetch',
      payload: searchParams,
    });
  }, []);

  function handleParams(type, params) {
    setSearchParams(params);
    dispatch({ type, payload: params });
  }

  function handlePageChange(page, pageSize) {
    dispatch({ type: 'lop/reload', payload: { page, pageSize, ...searchParams } });
  }
  async function handleUpload(params) {
    await dispatch({ type: 'lop/importByManual', payload: params });
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
      aLink.href = `/download?filePath=${reportUrl}`;
      aLink.click();
    }
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <LopLogFilterForm loading={loading} onParams={handleParams} />
        <LopLogManualModal
          visible={visible}
          loading={loading['lop/importByManual']}
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
            total={total}
            dataSource={logs}
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
