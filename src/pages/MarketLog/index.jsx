import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MarketLogFilterForm from './MarketLogFilterForm';
import MarketLogList from './MarketLogList';

export default function() {
  return (
    <PageHeaderWrapper>
      <MarketLogFilterForm />
      <MarketLogList />
    </PageHeaderWrapper>
  );
}
