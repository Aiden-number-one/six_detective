import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Row } from 'antd';
import { FormattedMessage } from 'umi/locale';
import PageNav from '@/pages/AlertCenter/PageNav';
import LopLogFilterForm from './LopLogFilterForm';
import LopLogList from './LopLogList';
import LopLogManualModal from './LopLogManualModal';
import styles from './index.less';

export function LopLog({ dispatch, logs, loading }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    dispatch({
      type: 'lop/fetch',
    });
  }, []);

  function handleSearch(params) {
    dispatch({ type: 'lop/reload', params });
  }

  function handleManual(params) {
    dispatch({ type: 'lop/importByManual', params });
  }

  function handleAuto() {
    dispatch({ type: 'lop/importByAuto' });
  }
  return (
    <>
      <PageNav routes={{ name: 'import lop data', link: '/data-import/lop' }} />
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
          <Button type="primary" onClick={() => setVisible(true)}>
            <FormattedMessage id="data-import.lop.manual-import" />
          </Button>
        </Row>
        <LopLogList dataSource={logs} loading={loading['lop/fetch']} />
      </div>
    </>
  );
}

export default connect(({ loading, lop: { logs } }) => ({ logs, loading: loading.effects }))(
  LopLog,
);
