import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Button, Form, Input } from 'antd';
import { formatMessage } from 'umi/locale';

class FormUser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <Form>
          <Form.Item label="User Id：" labelCol={{ span: 2 }} wrapperCol={{ span: 4 }}>
            {getFieldDecorator('userId', {
              rules: [
                {
                  required: true,
                  message: 'Please input your UserId',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.common.username' })}
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 4 }}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input your 员工姓名',
                },
              ],
            })(<Input />)}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

export default class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageHeaderWrapper>
        <Fragment>
          <Row type="flex" justify="end">
            <Col>
              <Button>CANCEL</Button>
              <Button type="primary">SAVE</Button>
            </Col>
          </Row>
          <NewFormUser />
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}
