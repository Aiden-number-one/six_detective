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
import '@/assets/css/index.less';

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const footerRender = () => null;

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
      siderWidth={200}
      logo={collapsed ? logoSamll : logo}
      headerRender={headerViewProps => <span>111222</span>}
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
