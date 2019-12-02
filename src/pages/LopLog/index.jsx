import React, { useState } from 'react';
import { Button, Row } from 'antd';
import { FormattedMessage } from 'umi/locale';

import LopLogFilterForm from './LopLogFilterForm';
import LopLogTable from './LopLogTable';
import LopLogManualModal from './LopLogManualModal';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './index.less';

export default function() {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.container}>
      <LopLogFilterForm />
      <LopLogManualModal visible={visible} handleCancel={() => setVisible(false)} />
      <Row className={styles['btn-group']} type="flex" justify="center">
        <Button type="primary">
          <FormattedMessage id="data-import.lop.auto-import" />
        </Button>
        <Button type="primary" onClick={() => setVisible(true)}>
          <FormattedMessage id="data-import.lop.manual-import" />
        </Button>
      </Row>
      <Row className={styles['table-title']}>
        <FormattedMessage id="data-import.lop.history" />
      </Row>
      <LopLogTable />
    </div>
  );
}
