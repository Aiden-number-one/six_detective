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
import router from 'umi/router';
// import CustomizeSelectLang from '@/components/CustomizeSelectLang';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/images/logo.png';
import logoSamll from '../assets/images/logo-small.png';
import styles from './BasicLayout.less';
// import globalStyles from '@/assets/css/index.less';
import IconFont from '@/components/IconFont';

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
    {/* <img src={require('@/assets/logo.png')} alt="HKEX" /> */}
    <div>@ 2019 Hong Kong Exchanges and Clearing Limited. All rights reserved</div>
  </footer>
);

const BasicLayout = props => {
  const { dispatch, children, settings, collapsed, menuData, taskCount, alertCount } = props;

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
        type: 'menu/getTaskCount',
        payload: {},
      });
      dispatch({
        type: 'menu/getAlertCount',
        payload: {},
      });
      dispatch({
        type: 'login/getLoginStatus',
        payload: {
          // loginName: window.localStorage.currentUser,
          // userAgent: window.navigator.userAgent,
        },
      });
      setInterval(() => {
        if (window.location.pathname !== '/login') {
          dispatch({
            type: 'login/getLoginStatus',
            payload: {
              // loginName: window.localStorage.currentUser,
              // userAgent: window.navigator.userAgent,
            },
          });
        }
      }, 60000);
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
        <IconFont type="icon-signout" style={{ marginRight: 5 }} />
        Sign Out
      </a>
    </div>
  );

  const infoContent = () => (
    <div className={styles.infoContent}>
      <a
        onClick={() => {
          router.push('/homepage/alert-center');
        }}
      >
        <span>
          <IconFont type="icon-alert" style={{ marginRight: 5 }} />
          Alert Center
        </span>
        <span>({taskCount})</span>
      </a>
      <a
        onClick={() => {
          router.push('/homepage/Approval-Process-Center');
        }}
      >
        <span>
          <IconFont type="icon-approval" style={{ marginRight: 5 }} />
          Approval Process Center
        </span>
        <span>({alertCount})</span>
      </a>
    </div>
  );

  // if (window.location.pathname === '/') {
  //   return (
  //     <div className={styles.headerRender} style={{ position: 'absolute', border: 'none' }}>
  //       <div className={styles.left} style={{ border: 'none' }}>
  //         <Icon
  //           className={styles.collapsed}
  //           type={collapsed ? 'menu-unfold' : 'menu-fold'}
  //           onClick={() => handleMenuCollapse()}
  //         />
  //       </div>
  //     </div>
  //   );
  // }
  // return
  const headerRender = () => (
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
          <Popover
            placement="bottomRight"
            content={infoContent()}
            trigger="click"
            overlayClassName="taskinfo"
          >
            {(Number(taskCount) > 0 || Number(alertCount) > 0) && (
              <Badge dot>
                <IconFont type="icon-xiaoxi" className={styles.bell} />
              </Badge>
            )}
            {Number(taskCount) === 0 && Number(alertCount) === 0 && (
              <IconFont type="icon-xiaoxi" className={styles.bell} />
            )}
          </Popover>
        </div>
        <div className={styles.user}>
          <IconFont type="icon-usercircle" className={styles.avatar} />
          {/* <CustomizeSelectLang /> */}
          <span title={window.localStorage.loginName} className={styles.username}>
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

  return (
    <div className="proLayout">
      <ProLayout
        iconfontUrl={`http://${window.location.host}/iconfont.js`}
        siderWidth={250}
        logo={collapsed ? logoSamll : logo}
        headerRender={headerRender}
        menuHeaderRender={logoItem => (
          <a
            onClick={() => {
              router.push('/');
            }}
          >
            {logoItem}
          </a>
        )}
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
            const latestOpenKey = openKeysNew.slice(-1) ? openKeysNew.slice(-1)[0] : '';
            if (menuData.map(value => value.page).indexOf(latestOpenKey) === -1) {
              setOpenKeys(openKeysNew);
            } else {
              setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            }
          },
        }}
      >
        {children}
      </ProLayout>
    </div>
  );
};

export default connect(({ global, settings, menu }) => ({
  collapsed: global.collapsed,
  settings,
  menuData: menu.menuData,
  taskCount: menu.taskCount,
  alertCount: menu.alertCount,
}))(BasicLayout);
