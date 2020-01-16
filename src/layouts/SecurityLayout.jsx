import React from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';
import { message } from 'antd';
import router from 'umi/router';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import { getStore } from '@/utils/store';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
    loading: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.setState({
      isReady: true,
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
    dispatch({
      type: 'menu/getMenuData',
      callback: (m, menuList) => {
        // newMenuData = Object.assign([], menuData);
        if (m.length <= 0) {
          message.warning('The menu is empty');
          dispatch({
            type: 'login/logout',
          });
        }
        if (!menuList.some(element => element.page.includes(location.pathname))) {
          dispatch({
            type: 'menu/getAdminMenuData',
            payload: {},
            callback: adminList => {
              if (adminList.some(item => item.page.includes(location.pathname))) {
                router.push('/no-access');
                this.setState({
                  loading: false,
                });
              } else {
                // router.push('/404');
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
