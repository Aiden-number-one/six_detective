import React, { Component } from 'react';
import { Form, Input, DatePicker, Radio, Select, Row, Col, Button, Modal } from 'antd';
import CornContent from './CornContent';

const { Option } = Select;
// eslint-disable-next-line react/prefer-stateless-function
class PlanAddForm extends Component {
  state = {
    cornVisible: true,
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { cornVisible } = this.state;
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
      <>
        <Modal visible={cornVisible}>
          <CornContent />
        </Modal>
        <Form {...formItemLayout}>
          <Form.Item label="计划开始执行时间:">
            {getFieldDecorator('executeTime', {
              rules: [
                {
                  required: true,
                  message: 'Please input your executeTime',
                },
              ],
              initialValue: '',
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
                  initialValue: '',
                })(<Input placeholder="32 characters maximum" />)}
              </Col>
              <Col span={8}>
                {getFieldDecorator('frequency', {
                  rules: [
                    {
                      required: false,
                      message: 'Please input your frequency',
                    },
                  ],
                  initialValue: 'D',
                })(
                  <Select>
                    <Option value="D">日</Option>
                    <Option value="H">小时</Option>
                    <Option value="M">分钟</Option>
                  </Select>,
                )}
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={<Button onClick={() => {}}>CORN表达式</Button>}>
            {getFieldDecorator('cronExpression', {
              rules: [
                {
                  required: true,
                  message: 'Please input your cronExpression',
                },
              ],
              initialValue: '',
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
              initialValue: 1,
            })(
              <Radio.Group>
                <Radio value={1}>按交易日</Radio>
                <Radio value={2}>按自然日</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label=" 成功邮件:">
            {getFieldDecorator('succeedMailId', {
              rules: [
                {
                  required: false,
                  message: 'Please input your succeedMailId',
                },
              ],
              initialValue: '',
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item label="出错邮件:">
            {getFieldDecorator('faultMailId', {
              rules: [
                {
                  required: false,
                  message: 'Please input your faultMailId',
                },
              ],
              initialValue: '',
            })(<Input placeholder="" />)}
          </Form.Item>
        </Form>
      </>
    );
  }
}

export default Form.create({})(PlanAddForm);
