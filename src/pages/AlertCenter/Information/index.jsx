import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import InformationList from './InformationList';

function Information({ dispatch, loading, infomations = [] }) {
  useEffect(() => {
    dispatch({
      type: 'alertCenter/fetch',
    });
  });
  return (
    <PageHeaderWrapper>
      <InformationList dataSource={infomations} loading={loading['alertCenter/fetch']} />
    </PageHeaderWrapper>
  );
}

export default connect(({ loading, alertCenter: { infomations } }) => ({
  infomations,
  loading: loading.effects,
}))(Information);
