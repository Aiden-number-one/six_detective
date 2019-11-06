import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import logoDark from '../assets/logo-dark.png';
import logo from '../assets/logo.png';
import loginBg from '../assets/loginBg.png';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              {/* <Link to="/login"> */}
              <img alt="logo" className={styles.logo} src={logoDark} />
              <span className={styles.title}>Welcome to HKEX</span>
              {/* </Link> */}
            </div>
          </div>
          <div className={styles.loginContent}>
            <img src={loginBg} className={styles.loginBg} alt="" />
            {children}
          </div>
          <div className={styles.footer}>
            <img src={logo} alt="" />
            <div>@ 2019 Hong Kong Exchanges and Clearing Limited. All rights reserved</div>
          </div>
        </div>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
