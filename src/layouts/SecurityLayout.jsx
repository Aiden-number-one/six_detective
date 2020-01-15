import React from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import { getStore } from '@/utils/store';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
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
    });
  }

  render() {
    const { isReady } = this.state;
    const { children } = this.props;
    const isLogin = getStore('employeeId');
    const queryString = stringify({
      redirect: window.location.href,
    });

    if (!isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      return <Redirect to={`/login?${queryString}`}></Redirect>;
    }
    return children;
  }
}

export default connect(() => ({}))(SecurityLayout);
