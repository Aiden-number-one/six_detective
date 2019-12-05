import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AlertDetail from './AlertDetail';
import AlertList from './AlertList';
import styles from './index.less';

function Alert({ dispatch, alerts }) {
  const [alert, setAlert] = useState({});
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
        <AlertList dataSource={alerts} getAlert={item => setAlert(item)} />
        <AlertDetail alert={alert} />
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ alertCenter: { alerts } }) => ({ alerts }))(Alert);
