import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import PageNav from './PageNav';
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
    <>
      <PageNav routes={{ name: 'Alert Center', link: '/alert-center' }} />
      <div className={styles['list-container']}>
        <AlertList dataSource={alerts} getAlert={item => setAlert(item)} />
        <AlertDetail alert={alert} />
      </div>
    </>
  );
}

export default connect(({ alertCenter: { alerts } }) => ({ alerts }))(Alert);
