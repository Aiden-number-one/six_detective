/*
 * @Description: 表单控件
 * @Author: lan
 * @Date: 2019-10-25 13:42:35
 * @LastEditTime: 2019-10-29 13:41:03
 * @LastEditors: lan
 */
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Form,
  Button,
  Input,
  Checkbox,
  Select,
  DatePicker,
  LocaleProvider,
  Row,
  Col,
  Radio,
} from 'antd';
import styles from './FormItem.less';

const { TextArea } = Input;
const { Option } = Select;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 8 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 16 },
//   },
// };

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
      <PageHeaderWrapper>
        <div>
          <Button>CANCEL</Button>
          <span> </span>
          <Button type="primary">SEARCH</Button>
          <span> </span>
        </div>
        <h2>Transaction Originator Section Lop Input Form 2</h2>
        <Form className={styles['form-item']} {...formItemLayout}>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="Trade Data" required>
                {getFieldDecorator('tradeData', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(
                  <LocaleProvider locale="en-us">
                    <DatePicker style={{ width: '100%' }} disabled />
                  </LocaleProvider>,
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="EP Code">
                {getFieldDecorator('epCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Submitter Code">
                {getFieldDecorator('submitterCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Submitter Name">
                {getFieldDecorator('submitterName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="TO Code">
                {getFieldDecorator('toCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="TO Name">
                {getFieldDecorator('toName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="LOP A/C NO.">
                {getFieldDecorator('phoneNO', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="A/C Name">
                {getFieldDecorator('acName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Reported BI Name" labelCol={{ md: 5 }}>
                {getFieldDecorator('RBIName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Reported TO Name" labelCol={{ md: 5 }}>
                {getFieldDecorator('RTOName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Type of Account" labelCol={{ md: 5 }}>
                {getFieldDecorator('accountType', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: 'house',
                })(
                  <Radio.Group>
                    <Radio value="house">House</Radio>
                    <Radio value="client">Cilent</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Nature of Account" labelCol={{ md: 5 }}>
                {getFieldDecorator('accountNature', {
                  rules: [{ required: false }],
                  initialValue: undefined,
                })(
                  <Checkbox.Group>
                    <Checkbox onChange={() => {}} value="Hedge">
                      Hedge
                    </Checkbox>
                    <Checkbox onChange={() => {}} value="Trading">
                      Trading
                    </Checkbox>
                    <Checkbox onChange={() => {}} value="Arbitrage">
                      Arbitrage
                    </Checkbox>
                  </Checkbox.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <h2>Option Series</h2>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="A/C Name">
                {getFieldDecorator('acName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="A/C Name">
                {getFieldDecorator('acName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Type of Account" labelCol={{ md: 5 }}>
                {getFieldDecorator('accountType', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: 'house',
                })(
                  <Radio.Group>
                    <Radio value="house">House</Radio>
                    <Radio value="client">Cilent</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <h2>BI/Omni Section Lop Input Form 2</h2>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="A/C Name">
                {getFieldDecorator('acName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="A/C Name">
                {getFieldDecorator('acName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item label="Reported BI Name" labelCol={{ md: 5 }}>
                {getFieldDecorator('RBIName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item label="Submitter Name">
                {getFieldDecorator('submitterName', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="TO Code">
                {getFieldDecorator('toCode', {
                  rules: [{ required: true, message: 'Error' }],
                  initialValue: undefined,
                })(<Input placeholder="Type your answer here" disabled />)}
              </Form.Item>
            </Col>
          </Row>

          {/* <Form.Item wrapperCol={{ offset: 8 }}>
            <Button>CANCEL</Button>
            <span> </span>
            <Button type="primary">SEARCH</Button>
            <span> </span>
            <Button className="Add" icon="plus">
              New Data
            </Button>
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
          <Form.Item label="Approved Text">
            {getFieldDecorator('Input', {
              rules: [{ required: true, message: 'Error' }],
              initialValue: undefined,
            })(<Input placeholder="Type your answer here" style={{ width: 200 }} />)}
          </Form.Item>
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
          <Form.Item></Form.Item> */}
        </Form>
      </PageHeaderWrapper>
    );
  }
}
