/*
 * @Description: 登录
 * @Author: mus
 * @Date: 2019-09-19 20:01:46
 * @LastEditTime: 2019-11-13 09:26:52
 * @LastEditors: lan
 * @Email: mus@szkingdom.com
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Alert } from 'antd';
import LoginComponent from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = LoginComponent;

@connect(state => ({
  login: state.login,
}))
class Login extends Component {
  state = {
    type: 'account',
    // autoLogin: true,
    submitting: false, // submit loading
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { loginName, loginPwd } = values;
    this.setState({
      submitting: true,
    });
    if (!err) {
      const { dispatch } = this.props;
      const param = {
        loginname: loginName,
        password: window.kddes.getDes(loginPwd),
        storeId: '100',
        ipAddress: '127.0.0.1',
        loginType: '0',
        loginFromWay: '0',
        // businessCode: '1001',
      };
      dispatch({
        type: 'login/getLogin',
        payload: param,
        callback: response => {
          this.setState({
            submitting: false,
          });
          if (response.bcjson.flag === '0') {
            return;
          }
          const items = response.bcjson.items[0];
          localStorage.setItem('currentUser', items.name);
          router.push('/');
        },
      });
    }
    this.setState({
      submitting: false,
    });
  };

  // changeAutoLogin = e => {
  // this.setState({
  //   autoLogin: e.target.checked,
  // });
  // };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { type, submitting } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponent
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div style={{ marginTop: 30 }}>
            <div
              style={{
                margin: '0 2px',
                textAlign: 'right',
                color: '#10416c',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              USER LOGIN
            </div>
            <UserName
              name="loginName"
              placeholder="Log in"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'Error' }),
                },
              ]}
              style={{ height: 40 }}
            />
            <Password
              name="loginPwd"
              placeholder="Password"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'Error' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
              style={{ height: 40 }}
            />
          </div>

          {/* <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="记住密码" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="忘记密码" />
            </a>
          </div> */}
          <Submit loading={submitting} style={{ height: 40 }}>
            <FormattedMessage id="LOG IN" />
          </Submit>
        </LoginComponent>
      </div>
    );
  }
}

export default Login;
