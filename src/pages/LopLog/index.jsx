import React from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'umi/locale';

import LopLogFilterForm from './LopLogFilterForm';
import LopLogTable from './LopLogTable';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './index.less';

export default function() {
  return (
    <div>
      <LopLogFilterForm />
      <div>
        <Button>
          <FormattedMessage id="data-import.lop.search" />
        </Button>
        <Button>
          <FormattedMessage id="data-import.lop.auto-import" />
        </Button>
        <Button>
          <FormattedMessage id="data-import.lop.manual-import" />
        </Button>
      </div>
      <LopLogTable />
    </div>
  );
}
