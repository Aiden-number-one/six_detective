import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Row } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi/locale';
import FilterForm from '../FilterForm';
import LopLogList from './LopLogList';
import LopLogManualModal from './LopLogManualModal';
import useLog from '../hooks';
import styles from '../index.less';

export function LopLog({ dispatch, loading, page: current, logs, total }) {
  const [visible, setVisible] = useState(false);
  const { dateRange, searchParams, handleParams, handlePageChange, handleDownload } = useLog({
    dispatch,
    type: 'lop',
  });

  async function getSubmitters(params) {
    return dispatch({
      type: 'lop/fetchSubmitters',
      payload: params,
    });
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
