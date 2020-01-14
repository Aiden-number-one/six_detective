import React from 'react';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import PageLoading from '@/components/PageLoading';
import { getStore } from '@/utils/store';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
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

export default SecurityLayout;
