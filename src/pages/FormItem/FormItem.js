/*
 * @Description: 表单控件
 * @Author: lan
 * @Date: 2019-10-25 13:42:35
 * @LastEditTime: 2019-10-28 14:12:42
 * @LastEditors: lan
 */
import React, { Component, Fragment } from 'react';
import { Form, Button, Input, Checkbox, Select, DatePicker, LocaleProvider } from 'antd';
import styles from './FormItem.less';

const { TextArea } = Input;
const { Option } = Select;

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
export default class FormItem extends Component {
  state = {};

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Fragment>
        <Form className={styles['form-item']} {...formItemLayout}>
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
          <Form.Item labelCol={{ offset: 8 }} wrapperCol={{ offset: 8 }} label="Sample Text">
            {getFieldDecorator('InputVertical', {
              rules: [{ required: false }],
              initialValue: undefined,
            })(<Input placeholder="Type Here" style={{ width: 200 }} />)}
          </Form.Item>
          {/* <Form.Item label="Approved Text">
            {getFieldDecorator('Input', {
              rules: [{ required: true, message: 'Error' }],
              initialValue: undefined,
            })(<Input placeholder="Type your answer here" style={{ width: 200 }} />)}
          </Form.Item> */}
          <Form.Item label="Approved Sample" validateStatus="success" help="Approved">
            <Input
              placeholder="Type your answer here"
              id="Approved"
              style={{ width: 200 }}
              disabled
            />
          </Form.Item>
          <Form.Item label="Error Sample" validateStatus="error" help="Error">
            <Input placeholder="Type your answer here" id="Error" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="Select">
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
          <Form.Item label="Generation Data">
            <LocaleProvider locale="en-us">
              <DatePicker style={{ width: 200 }} />
            </LocaleProvider>
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Fragment>
    );
  }
}
