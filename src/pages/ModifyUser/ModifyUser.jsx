import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Button, Form, Input, Checkbox, message } from 'antd';
import { formatMessage } from 'umi/locale';
// import { routerRedux } from 'dva/router';

class FormUser extends Component {
  constructor() {
    super();
    this.state = {
      menuUserGroups: ['Administrator', 'Operator', 'Supervisor', 'Enquriy'],
      alertUserGroups: ['Future Maker', 'Future Checker', 'Option Maker', 'Option Checker'],
    };
  }

  onChangeMenuUserGroup = checkedValues => {
    console.log('checkedValues=', checkedValues);
  };

  onChangeAlertUserGroup = checkedValues => {
    console.log('checkedValues=', checkedValues);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userInfo } = this.props;
    const { menuUserGroups, alertUserGroups } = this.state;
    return (
      <Fragment>
        <Form>
          <Form.Item label="User Id：" labelCol={{ span: 4 }} wrapperCol={{ span: 6 }}>
            {getFieldDecorator('userId', {
              rules: [
                {
                  required: true,
                  message: 'Please input your UserId',
                },
              ],
              initialValue: `${userInfo && userInfo.userId}`,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.common.username' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 6 }}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 6, offset: 4 }}>
            {getFieldDecorator('locked', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password',
                },
              ],
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>User Account Locked</Checkbox>)}
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 1 }}
            label={formatMessage({ id: 'systemManagement.userMaintenance.menuUserGroup' })}
          >
            {getFieldDecorator('menuUserGroup', {
              initialValue: ['Operator'],
            })(
              <Checkbox.Group
                options={menuUserGroups}
                defaultValue={['Operator']}
                onChange={this.onChangeMenuUserGroup}
              ></Checkbox.Group>,
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 1 }}
            label={formatMessage({ id: 'systemManagement.userMaintenance.alertUserGroup' })}
          >
            {getFieldDecorator('alertUserGroup', {
              initialValue: ['Future Maker', 'Future Checker'],
            })(
              <Checkbox.Group
                options={alertUserGroups}
                defaultValue={['Future Maker', 'Future Checker']}
                onChange={this.onChangeAlertUserGroup}
              ></Checkbox.Group>,
            )}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

export default class ModifyUser extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
  }

  static getDerivedStateFromProps(props) {
    const { query } = props.location;
    return {
      userInfo: query,
    };
  }

  componentDidMount() {
    console.log('modify,props=', this.props.location.query);
  }

  onCancel = () => {
    this.props.history.push({
      pathname: '/system-management/user-maintenance',
    });
  };

  onSave = () => {
    this.newUserRef.current.validateFields((err, values) => {
      console.log('values==', values);
      message.success('save success');
      this.props.history.push({
        pathname: '/system-management/user-maintenance',
        params: values,
      });
    });
  };

  render() {
    // const { query } = this.props.location
    const { userInfo } = this.state;
    return (
      <PageHeaderWrapper>
        <Fragment>
          <Row type="flex" justify="end">
            <Col>
              <Button onClick={this.onCancel}>CANCEL</Button>
              <Button type="primary" onClick={this.onSave}>
                SAVE
              </Button>
            </Col>
          </Row>
          <NewFormUser ref={this.newUserRef} userInfo={userInfo} />
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}
