/*
 * @Description: 表单控件样式例子
 * @Author: lan
 * @Date: 2019-11-01 14:30:01
 * @LastEditTime: 2019-11-01 17:33:47
 * @LastEditors: lan
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Button, Input, Checkbox, Select, DatePicker, Row, Col, Radio } from 'antd';
import iconDelete from '@/assets/icon_delete.svg';
import iconAdd from '@/assets/icon_add.svg';
import iconEdit from '@/assets/icon_edit.svg';

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    md: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    md: { span: 14 },
  },
};

const formItemCol = {
  xs: 24,
  md: 12,
};

const searchFormRow = {
  xs: 24,
  sm: 48,
  md: 144,
  lg: 48,
  xl: 96,
};

const searchFormCol = {
  xs: 12,
  sm: 12,
  lg: 8,
};

const FilterArr = [
  'Is not equal to',
  'Is equal to',
  'Start With',
  'Contains',
  'Does Not Contains',
  'Is Null',
  'Ends With',
  'Is not Null',
  'Is Empty',
  'Is not Empty',
  'Has No Value',
];

@Form.create()
export default class Stylespecification extends Component {
  state = {
    error: {},
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { error } = this.state;
    return (
      <PageHeaderWrapper>
        {/* 查询表单 */}
        <Form className="ant-advanced-search-form">
          <Row gutter={{ ...searchFormRow }}>
            <Col {...searchFormCol}>
              <Form.Item label="Select">
                {getFieldDecorator('Select', {})(
                  <Select placeholder="Please Select" dropdownClassName="selectDropdown">
                    {FilterArr.map(value => (
                      <Option value={value}>{value}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col {...searchFormCol}>
              <Form.Item label="Select">
                {getFieldDecorator('Select', {})(
                  <Select placeholder="Please Select" dropdownClassName="selectDropdown">
                    {FilterArr.map(value => (
                      <Option value={value}>{value}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col {...searchFormCol}>
              <Form.Item label="Select">
                {getFieldDecorator('Select', {})(
                  <Select placeholder="Please Select" dropdownClassName="selectDropdown">
                    {FilterArr.map(value => (
                      <Option value={value}>{value}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* 提交表单 */}
        <Form className={['form-item']} {...formItemLayout}>
          <Row>
            <Col {...formItemCol}>
              <Form.Item
                label="Trade Data"
                help={error.tradeData !== undefined && (error.tradeData ? 'Approved' : 'Error')}
              >
                {getFieldDecorator('tradeData', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(
                  <Input
                    placeholder="Type your answer here"
                    onChange={e => {
                      this.setState({
                        error: {
                          ...error,
                          tradeData: !!e.target.value,
                        },
                      });
                    }}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col {...formItemCol}>
              <Form.Item label="EP Code">
                {getFieldDecorator('epCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: 'EP Code',
                })(<Input placeholder="Type your answer here" />)}
              </Form.Item>
            </Col>
            <Col {...formItemCol}>
              <Form.Item label="Approved Text">
                {getFieldDecorator('Input', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col {...formItemCol}>
              <Form.Item label="Approved Sample" validateStatus="success" help="Approved">
                <Input placeholder="Type your answer here" id="Approved" />
              </Form.Item>
            </Col>
            <Col {...formItemCol}>
              <Form.Item label="Error Sample" validateStatus="error" help="Error">
                <Input placeholder="Type your answer here" />
              </Form.Item>
            </Col>
          </Row>

          {/* 按钮 */}
          <Form.Item>
            <Button>CANCEL</Button>
            <Button type="primary">SEARCH</Button>
            <Button type="danger">Delete</Button>
            <Button size="small" type="primary" icon="plus" />
            <Button size="small" type="primary" icon="edit" />
            <Button size="small" type="danger" icon="delete" />
          </Form.Item>

          {/* 多选框 */}
          <Form.Item>
            {getFieldDecorator('CheckBox', {
              rules: [{ required: true, message: 'Error' }],
              initialValue: undefined,
            })(
              <Checkbox.Group>
                <Checkbox value={1} checked={false}>
                  Sample Text
                </Checkbox>
                <Checkbox value={2} disabled>
                  Sample Text
                </Checkbox>
                <Checkbox value={3} checked disabled>
                  Sample Text
                </Checkbox>
              </Checkbox.Group>,
            )}
          </Form.Item>

          {/* 单选框 */}
          <Form.Item>
            {getFieldDecorator('Radio', {
              rules: [{ required: true, message: 'Error' }],
              initialValue: 'house',
            })(
              <Radio.Group>
                <Radio value="house">House</Radio>
                <Radio value="client">Cilent</Radio>
              </Radio.Group>,
            )}
          </Form.Item>

          {/* 文本域 */}
          <Form.Item>
            {getFieldDecorator('TextArea', {
              rules: [{ required: true, message: 'Error' }],
              initialValue: undefined,
            })(<TextArea placeholder="Type Here" rows={3} style={{ width: '60%' }} />)}
          </Form.Item>

          <Form.Item>
            <Select
              placeholder="please select"
              dropdownClassName="selectDropdown"
              style={{ width: 200 }}
            >
              {FilterArr.map(value => (
                <Option value={value}>{value}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <DatePicker style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <img src={iconAdd} alt="" />
            <img src={iconEdit} alt="" />
            <img src={iconDelete} alt="" />
          </Form.Item>
        </Form>
      </PageHeaderWrapper>
    );
  }
}
