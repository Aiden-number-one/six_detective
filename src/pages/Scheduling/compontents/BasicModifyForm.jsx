import React, { Component } from 'react';
import { Form, Input, DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
class BasicModifyForm extends Component {
  chooseJobId = () => {
    console.log('00000');
  };

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
          })(<Input placeholder="请输入最长64位字符（中文占两个字符）" />)}
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
          })(<Input onClick={this.chooseJobId} />)}
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
          })(<TextArea rows={2} placeholder="请输入最长1024位字符（中文占两个字符）" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({})(BasicModifyForm);
