import React from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';
import { message } from 'antd';
import router from 'umi/router';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import { getStore } from '@/utils/store';
import { formatRoutes } from '@/utils/utils';

class SecurityLayout extends React.Component {
  state = {
    routes: [],
    isReady: false,
    loading: true,
  };

  componentDidMount() {
    const { dispatch, route } = this.props;
    const newRoutes = formatRoutes(route.routes[0].routes);
    this.setState({
      isReady: true,
      routes: newRoutes,
    });
    dispatch({
      type: 'login/getLoginStatus',
      payload: {
        // loginName: window.localStorage.currentUser,
        // userAgent: window.navigator.userAgent,
      },
      callback: () => {},
      logging: () => {
        this.getMenu();
      },
    });
  }

  getMenu = () => {
    const { dispatch, location } = this.props;
    const { routes } = this.state;
    let subsistent = routes.filter(element => element.path && element.path.includes('/:'));
    subsistent = subsistent.map(element => element.path.split('/:')[0]);
    dispatch({
      type: 'menu/getMenuData',
      callback: (m, menuList) => {
        if (m.length <= 0) {
          message.warning('The menu is empty');
          dispatch({
            type: 'login/logout',
            callback: () => {
              this.setState({
                loading: false,
              });
            },
          });
        }
        if (!menuList.some(element => element.page.includes(location.pathname))) {
          if (location.pathname === '/homepage/information' || location.pathname === '/404') {
            this.setState({
              loading: false,
            });
          } else if (routes.some(item => item.path && item.path.includes(location.pathname))) {
            router.push('/no-access');
            this.setState({
              loading: false,
            });
          } else if (subsistent.some(element => location.pathname.includes(element))) {
            this.setState({
              loading: false,
            });
          } else {
            router.push('/404');
            this.setState({
              loading: false,
            });
          }
        } else {
          this.setState({
            loading: false,
          });
        }
      },
      errorFn: () => {
        this.setState({
          loading: false,
        });
      },
    });
  };

  render() {
    const { isReady, loading } = this.state;
    const { children } = this.props;
    const isLogin = getStore('employeeId');
    const queryString = stringify({
      redirect: window.location.href,
    });

    if (!isReady || loading) {
      return <PageLoading />;
    }
    if (!isLogin) {
      return <Redirect to={`/login?${queryString}`}></Redirect>;
    }
    return children;
  }
}

export default connect(({ menu }) => ({
  menuData: menu.menuData,
  adminMenuData: menu.adminMenuData,
}))(SecurityLayout);
