import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Breadcrumb } from 'antd';
import NavLink from 'umi/navlink';
import AlertDetail from './AlertDetail';
import AlertList from './AlertList';
import styles from './index.less';

function Alert({ dispatch, alerts }) {
  const [alert, setAlert] = useState({});
  useEffect(() => {
    dispatch({
      type: 'alertCenter/fetchAlerts',
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
      <Breadcrumb className={styles.nav}>
        <Breadcrumb.Item>
          <NavLink to="/">Home</NavLink>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <NavLink to="/alert-center">Alert Center</NavLink>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles['list-container']}>
        <AlertList dataSource={alerts} getAlert={item => setAlert(item)} />
        <AlertDetail alert={alert} />
      </div>
    </>
  );
}

export default connect(({ alertCenter: { alerts } }) => ({ alerts }))(Alert);
