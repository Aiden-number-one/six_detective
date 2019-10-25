/*
 * @Description: 表单控件
 * @Author: lan
 * @Date: 2019-10-25 13:42:35
 * @LastEditTime: 2019-10-25 16:11:10
 * @LastEditors: lan
 */
import React, { Component, Fragment } from 'react';
import { Form, Button, Input, Checkbox, Select } from 'antd';
import styles from './FormItem.less';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@Form.create()
export default class FormItem extends Component {
  state = {};

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Fragment>
        <Form className={styles['form-item']} {...formItemLayout}>
          <Form.Item label="CheckBox">
            {getFieldDecorator('CheckBox', {
              rules: [{ required: false }],
              initialValue: undefined,
            })(
              <Checkbox.Group>
                <Checkbox onChange={() => {}} checked={false}>
                  Sample Text
                </Checkbox>
                <Checkbox onChange={() => {}} disabled>
                  Sample Text
                </Checkbox>
              </Checkbox.Group>,
            )}
          </Form.Item>
          <Form.Item label="TextArea">
            {getFieldDecorator('TextArea', {
              rules: [{ required: false }],
              initialValue: undefined,
            })(<TextArea placeholder="Type Here" rows={3} style={{ width: '60%' }} />)}
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8 }}>
            <Button>CANCEL</Button>
            <span> </span>
            <Button type="primary">SEARCH</Button>
            <span> </span>
            <Button className="Add" icon="plus">
              New Data
            </Button>
            <span> </span>
          </Form.Item>
          <Form.Item labelCol={{ offset: 8 }} wrapperCol={{ offset: 8 }} label="Sample Text">
            {getFieldDecorator('Input', {
              rules: [{ required: false }],
              initialValue: undefined,
            })(<Input placeholder="Type Here" style={{ width: 200 }} />)}
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Fragment>
    );
  }
}
