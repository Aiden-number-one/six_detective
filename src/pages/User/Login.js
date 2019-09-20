/*
 * @Description: 登录
 * @Author: mus
 * @Date: 2019-09-19 20:01:46
 * @LastEditTime: 2019-09-20 09:29:05
 * @LastEditors: mus
 * @Email: mus@szkingdom.com
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Checkbox, Alert } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(state => ({
  login: state.login,
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
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
    const param = {
      loginName,
      loginPwd: window.kddes.getDes(loginPwd),
      storeId: '100',
      ipAddress: '127.0.0.1',
      loginType: '1',
      loginFromWay: '0',
      businessCode: '1001',
    };
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/getLogin',
        payload: param,
        callback: response => {
          this.setState({
            submitting: false,
          });
          if (response.kdjson.flag === '0') {
            return;
          }
          const items = response.kdjson.items[0];
          localStorage.setItem('currentUser', items.name);
          router.push('/');
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { type, autoLogin, submitting } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div style={{ marginTop: 30 }}>
            <UserName
              name="loginName"
              placeholder="请输入用户名"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: '用户名不能为空' }),
                },
              ]}
            />
            <Password
              name="loginPwd"
              placeholder="请输入登录密码"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: '密码不能为空' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </div>

          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="记住密码" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="忘记密码" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="登录" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
