import React, { Component, Fragment } from 'react';
import { Form, Input } from 'antd';

import styles from '../TaskSwitch.less';

export default class ModifyForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div>
          <Form layout="inline" className={styles.formWrap}>
            <Form.Item label="文件名称：">
              {getFieldDecorator('folderName', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your folderName',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
