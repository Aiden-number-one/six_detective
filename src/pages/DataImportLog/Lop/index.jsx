import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi/locale';
import LopLogFilterForm from './LopLogFilterForm';
import LopLogList from './LopLogList';
import LopLogManualModal from './LopLogManualModal';
import styles from '../index.less';

export function LopLog({ dispatch, loading, logs, total }) {
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  useEffect(() => {
    dispatch({
      type: 'lop/fetch',
    });
  }, []);

  function handleSearch(params) {
    setSearchParams(params);
    console.log(params);

    dispatch({ type: 'lop/reload', payload: params });
  }

  function handleManual(params) {
    dispatch({ type: 'lop/importByManual', payload: params });
  }

  function handleAuto() {
    dispatch({ type: 'lop/importByAuto' });
  }

  function handlePageChange(page, pageSize) {
    dispatch({ type: 'lop/reload', payload: { page, pageSize, ...searchParams } });
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <LopLogFilterForm handleSearch={handleSearch} />
        <LopLogManualModal
          visible={visible}
          handleCancel={() => setVisible(false)}
          handleUpload={handleManual}
        />
        <Row className={styles['btn-group']}>
          <Button type="primary" onClick={handleAuto} loading={loading['lop/importByAuto']}>
            <FormattedMessage id="data-import.lop.auto-import" />
          </Button>
          <Button type="primary" className={styles['no-margin']} onClick={() => setVisible(true)}>
            <FormattedMessage id="data-import.lop.manual-import" />
          </Button>
        </Row>
        <LopLogList
          total={total}
          dataSource={logs}
          loading={loading['lop/fetch']}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageChange}
        />
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
