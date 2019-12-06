import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import InformationList from './InformationList';
import styles from '../index.less';

function Information({ dispatch, loading, informations = [] }) {
  useEffect(() => {
    dispatch({
      type: 'alertCenter/fetch',
    });
  }, []);
  return (
    <PageHeaderWrapper>
      <div className={styles['list-container']}>
        <InformationList dataSource={informations} loading={loading['alertCenter/fetch']} />
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ loading, alertCenter: { informations } }) => ({
  informations,
  loading: loading.effects,
}))(Information);
