import React, { Component, Fragment } from 'react';
import { Form, Input } from 'antd';

import styles from '../../index.less';

export default class PasswordForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div>
          <Form layout="inline" className={styles.formWrap}>
            <Form.Item label="原密码：">
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 原密码',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="登陆密码：">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 登陆密码',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="确认密码：">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
