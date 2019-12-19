import React, { useState } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Row } from 'antd';
import NewAccountLogModal from './NewAccountLogModal';
import NewAccountLogList from './NewAccountLogList';

import styles from '../index.less';

function NewAccountLog({ dispatch, loading }) {
  const [visible, setVisible] = useState(false);

  async function handleUpload(params) {
    await dispatch({ type: 'new_account/importByManual', payload: params });
    setVisible(false);
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <NewAccountLogModal
          visible={visible}
          loading={loading}
          handleCancel={() => setVisible(false)}
          handleUpload={handleUpload}
        />
        <div className={styles['list-wrap']}>
          <Row className={styles['btn-group']}>
            <Button type="primary" className={styles['no-margin']} onClick={() => setVisible(true)}>
              <FormattedMessage id="data-import.manual-import" />
            </Button>
          </Row>
          <NewAccountLogList />
        </div>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ loading, new_account: { logs, page, total } }) => ({
  loading: loading.effects,
  logs,
  page,
  total,
}))(NewAccountLog);
