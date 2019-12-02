/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Icon, Badge, Popover } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { setLocale } from 'umi/locale';
import CustomizeSelectLang from '@/components/CustomizeSelectLang';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/logo.png';
import logoSamll from '../assets/logo-small.png';
import styles from './BasicLayout.less';
import '@/assets/css/index.less';
import IconFont from '@/components/IconFont';
import { isProOrDev } from '@/utils/utils';

const menus = [
  {
    path: '/data-management',
    name: 'dataManagement',
    locale: 'menu.dataManagement',
    children: [
      {
        path: '/data-management/data-import',
        name: 'dataImport',
        children: [
          {
            path: '/data-management/data-import/lop-data-import',
            name: 'lopDataImport',
          },
          {
            path: '/data-management/data-import/market-data-import',
            name: 'marketDataImport',
          },
        ],
      },
    ],
  },
];

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    // console.log(localItem);

    return Authorized.check(item.authority, localItem, null);
  });

const footerRender = () => (
  <footer className={styles.footerRender}>
    {/* eslint-disable-next-line global-require */}
    <img src={require('@/assets/logo.png')} alt="香港交易所" />
    <div>@ 2019 Hong Kong Exchanges and Clearing Limited. All rights reserved</div>
  </footer>
);

const BasicLayout = props => {
  const { dispatch, children, settings, collapsed, menuData } = props;

  // console.log('props=========', props);
  /**
   * constructor
   */
  const [openKeys, setOpenKeys] = useState([]);

  // const listenClose = () => {
  //   window.localStorage.clear();
  // }

  useEffect(() => {
    setLocale('en-US');
    // window.addEventListener('beforeunload', listenClose, false);
    if (dispatch) {
      dispatch({
        type: 'menu/getMenuData',
      });
      dispatch({
        type: 'login/getLoginStatus',
        payload: {
          // loginName: window.localStorage.currentUser,
          // userAgent: window.navigator.userAgent,
        },
      });
      if (!isProOrDev) {
        setInterval(() => {
          dispatch({
            type: 'login/getLoginStatus',
            payload: {
              // loginName: window.localStorage.currentUser,
              // userAgent: window.navigator.userAgent,
            },
          });
        }, 25000);
      }
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = () =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });

  const popoverContent = () => (
    <div className={styles.popover}>
      <div className={styles.popoverHeader}>
        <p>Surveillacnce Dep.</p>
        <p>thomaschow@hkex.com</p>
      </div>
      <div className={styles.popoverContent}>
        <div className={styles.left}>
          <div className={styles.imgBox}></div>
          <span>Profile</span>
        </div>
        <div className={styles.right}>
          <div className={styles.imgBox}></div>
          <span>Setting</span>
        </div>
      </div>
      <div className={styles.popoverFooter}>
        <a
          onClick={() => {
            if (dispatch) {
              dispatch({
                type: 'login/logout',
              });
            }
          }}
        >
          Sign Out
        </a>
      </div>
    </div>
  );

  const headerRender = () => {
    if (window.location.pathname === '/') {
      return (
        <div className={styles.headerRender} style={{ position: 'absolute', border: 'none' }}>
          <div className={styles.left} style={{ border: 'none' }}>
            <Icon
              className={styles.collapsed}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={() => handleMenuCollapse()}
            />
          </div>
        </div>
      );
    }
    return (
      <div className={styles.headerRender}>
        <div className={styles.left}>
          <Icon
            className={styles.collapsed}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => handleMenuCollapse()}
          />
        </div>
        <div className={styles.right}>
          <div className={styles.info}>
            <Badge dot>
              <IconFont type="icon-xiaoxi" className={styles.bell} />
            </Badge>
          </div>
          <div className={styles.user}>
            <IconFont type="icon-usercircle" className={styles.avatar} />
            <CustomizeSelectLang />
            <span title="Thomas Chow" className={styles.username}>
              {window.localStorage.loginName}
            </span>
            <Popover
              placement="bottomRight"
              content={popoverContent()}
              trigger="click"
              overlayClassName="userinfo"
            >
              <Icon type="caret-down" />
            </Popover>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProLayout
      iconfontUrl={`http://${window.location.host}/iconfont.js`}
      siderWidth={250}
      logo={collapsed ? logoSamll : logo}
      headerRender={headerRender}
      menuHeaderRender={logoItem => <a>{logoItem}</a>}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        if (menuItemProps.iframeUrl) {
          return (
            <Link
              to={{
                pathname: menuItemProps.path,
                query: {
                  iframeUrl: menuItemProps.iframeUrl,
                },
              }}
            >
              {defaultDom}
            </Link>
          );
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
      menuDataRender={() => menuDataRender(menuData)}
      // menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      // menuRender={(a, b) => {
      //   debugger;
      //   return null;
      // }}
      {...props}
      {...settings}
      // 展开一个，其他默认收起
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

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
  menuData: menus,
}))(BasicLayout);
