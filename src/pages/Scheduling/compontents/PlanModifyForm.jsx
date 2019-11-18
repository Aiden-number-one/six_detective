import React, { Component } from 'react';
import { Form, Input, DatePicker } from 'antd';

import moment from 'moment';

// eslint-disable-next-line react/prefer-stateless-function
class PlanModifyForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRows } = this.props;
    const defaultSelectedValue = selectedRows[0];
    // const { selectValue } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <Form {...formItemLayout}>
        <Form.Item label="计划开始执行时间:">
          {getFieldDecorator('executeTime', {
            initialValue: moment(defaultSelectedValue.executeTime, 'YYYY-MM-DD HH:mm:ss'),
          })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime />)}
        </Form.Item>
        <Form.Item label=" cron表达式:">
          {getFieldDecorator('cronExpression', {
            rules: [
              {
                required: true,
                message: 'Please input your cronExpression',
              },
            ],
            initialValue: defaultSelectedValue.cronExpression,
          })(<Input placeholder="" />)}
        </Form.Item>
        <Form.Item label=" 成功邮件:">
          {getFieldDecorator('succeedMailId', {
            rules: [
              {
                required: true,
                message: 'Please input your succeedMailId',
              },
            ],
            initialValue: defaultSelectedValue.succeedMailId,
          })(<Input placeholder="" />)}
        </Form.Item>
        <Form.Item label="出错邮件:">
          {getFieldDecorator('faultMailId', {
            rules: [
              {
                required: true,
                message: 'Please input your faultMailId',
              },
            ],
            initialValue: defaultSelectedValue.faultMailId,
          })(<Input placeholder="" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({})(PlanModifyForm);
