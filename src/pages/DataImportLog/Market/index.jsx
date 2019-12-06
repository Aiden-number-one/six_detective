import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MarketLogFilterForm from './MarketLogFilterForm';
import MarketLogList from './MarketLogList';
import styles from '../index.less';

export default function() {
  return (
    <PageHeaderWrapper>
      <div className={styles.container}>
        <MarketLogFilterForm />
        <MarketLogList />
      </div>
    </PageHeaderWrapper>
  );
}
