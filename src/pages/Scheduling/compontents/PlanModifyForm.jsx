import React, { Component } from 'react';
import { Form, Input, DatePicker, Select, Radio, Row, Col } from 'antd';

import moment from 'moment';

const { Option } = Select;

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
        <Form.Item label="执行频度:">
          <Row gutter={8}>
            <Col span={16}>
              {getFieldDecorator('scheduleInterval', {
                rules: [
                  {
                    required: false,
                    message: 'Please input your scheduleInterval',
                  },
                ],
                initialValue: defaultSelectedValue.scheduleInterval || '',
              })(<Input placeholder="请输入最长32位字符" />)}
            </Col>
            <Col span={8}>
              {getFieldDecorator('frequency', {
                rules: [
                  {
                    required: false,
                    message: 'Please input your frequency',
                  },
                ],
                initialValue: defaultSelectedValue.frequency || '',
              })(
                <Select>
                  <Option value="">请选择</Option>
                  <Option value="D">日</Option>
                  <Option value="H">小时</Option>
                  <Option value="M">分钟</Option>
                </Select>,
              )}
            </Col>
          </Row>
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
        <Form.Item label=" 调度规律:" style={{ textAlign: 'left' }}>
          {getFieldDecorator('scheduleLaw', {
            rules: [
              {
                required: false,
                message: 'Please input your scheduleLaw',
              },
            ],
            initialValue: defaultSelectedValue.scheduleLaw,
          })(
            <Radio.Group>
              <Radio value="1">按交易日</Radio>
              <Radio value="2">按自然日</Radio>
            </Radio.Group>,
          )}
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
