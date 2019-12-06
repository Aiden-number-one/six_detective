import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import AlertDetail from './AlertDetail';
import AlertList from './AlertList';
import styles from './index.less';

function Alert({ dispatch, loading, alerts = [] }) {
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    dispatch({
      type: 'alertCenter/fetch',
    });
  }, []);

  // default alert
  useEffect(() => {
    if (alerts.length > 0) {
      const [firstAlert] = alerts;
      setAlert(firstAlert);
    }
  }, [alerts]);

  return (
    <PageHeaderWrapper>
      <div className={styles['list-container']}>
        <AlertList
          dataSource={alerts}
          getAlert={item => setAlert(item)}
          loading={loading['alertCenter/fetch']}
        />
        {alert && <AlertDetail alert={alert} />}
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ loading, alertCenter: { alerts } }) => ({
  alerts,
  loading: loading.effects,
}))(Alert);
