import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import logoTrans from '../assets/logo-trans.png';
import styles from './UserLayout.less';
// import CustomizeSelectLang from '@/components/CustomizeSelectLang';

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
        <div className={styles.bgdiv}></div>
        {/* <SelectLang /> */}
        {/* <CustomizeSelectLang /> */}
        <div className={styles.content}>
          <div className={styles.loginContent}>
            <div className={styles.logoDiv}>
              <img alt="logo" className={styles.logo} src={logoTrans} />
              <span className={styles.title}>Welcome to Super LOP System</span>
            </div>
            <div className={styles.loginDiv}>{children}</div>
          </div>
          <div className={styles.footer}>
            <div>@ 2019 Hong Kong Exchanges and Clearing Limited. All rights reserved</div>
          </div>
        </div>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
