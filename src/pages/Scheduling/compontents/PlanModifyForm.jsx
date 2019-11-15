import React, { Component } from 'react';
import { Form, Input, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

// eslint-disable-next-line react/prefer-stateless-function
class PlanModifyForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    // const { emailObj } = this.props;
    const rangeConfig = {
      rules: [{ type: 'array', required: false, message: '请选择时间' }],
    };
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
        <Form.Item label=" 计划名称:">
          {getFieldDecorator('scheduleName', {
            rules: [
              {
                required: true,
                message: 'Please input your scheduleName',
              },
            ],
            initialValue: '',
          })(<Input />)}
        </Form.Item>

        <Form.Item label="调度作业:">
          {getFieldDecorator('jobId', {
            rules: [
              {
                required: true,
                message: 'Please input your jobId',
              },
            ],
            initialValue: '',
          })(<Input />)}
        </Form.Item>
        <Form.Item label="计划有效时间:">
          {getFieldDecorator('validDate', rangeConfig)(<RangePicker />)}
        </Form.Item>
        <Form.Item label="计划描述:">
          {getFieldDecorator('scheduleDesc', {
            rules: [
              {
                required: false,
                message: 'Please input your scheduleDesc',
              },
            ],
            initialValue: '',
          })(<Input />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({})(PlanModifyForm);
