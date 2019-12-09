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
    dispatch({ type: 'lop/reload', payload: params });
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
          handleUpload={params => dispatch({ type: 'lop/importByManual', payload: params })}
        />
        <Row className={styles['btn-group']}>
          {/* <Button
            type="primary"
            onClick={() => dispatch({ type: 'lop/importByAuto' })}
            loading={loading['lop/importByAuto']}
          >
            <FormattedMessage id="data-import.lop.auto-import" />
          </Button> */}
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
