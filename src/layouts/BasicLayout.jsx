/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/logo.png';
import logoSamll from '../assets/logo-small.png';
import styles from './BasicLayout.less';
import '@/assets/css/index.less';

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const footerRender = () => (
  <div className={styles.footerRender}>
    {/* eslint-disable-next-line global-require */}
    <img src={require('@/assets/logo.png')} alt="香港交易所" />
    <div>@ 2019 Hong Kong Exchanges and Clearing Limited. All rights reserved</div>
  </div>
);
const headerRender = () => (
  <div className={styles.headerRender}>
    <div className={styles.left}>
      <div>Welcome,John</div>
      <div>Last Login: 03-Jun-2019 21:00 HKT</div>
    </div>
    <div className={styles.right}></div>
  </div>
);
const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    collapsed,
    // menuData
  } = props;
  /**
   * constructor
   */
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: 'menu/getMenuData',
      //   payload: {
      //     customerno: 'system',
      //     endType: '1',
      //   },
      // });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

  return (
    <ProLayout
      siderWidth={250}
      logo={collapsed ? logoSamll : logo}
      headerRender={headerRender}
      menuHeaderRender={logoItem => <a>{logoItem}</a>}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      // menuDataRender={() => menuDataRender(menuData)}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      // menuRender={(a, b) => {
      //   debugger;
      //   return null;
      // }}
      {...props}
      {...settings}
      menuProps={{
        openKeys,
        onOpenChange: openKeysNew => {
          setOpenKeys(openKeysNew);
        },
      }}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ global, settings, menu }) => ({
  collapsed: global.collapsed,
  settings,
  menuData: menu.menuData,
}))(BasicLayout);
