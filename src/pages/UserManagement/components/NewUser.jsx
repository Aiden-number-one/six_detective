import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, Checkbox, Radio, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import styles from '../UserManagement.less';

class FormUser extends Component {
  constructor() {
    super();
    this.state = {
      //   menuUserGroups: ['Administrator', 'Operator', 'Supervisor', 'Enquriy'],
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    // const { alertUserGroups } = this.state;
    // const { menuUserGroups } = this.props;
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
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.common.username' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 6 }}
          >
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: 'Please input your username',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.common.password' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 6 }}
          >
            {getFieldDecorator('userPwd', {
              rules: [
                {
                  required: true,
                  message: 'Please input your password',
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          {/* <Form.Item wrapperCol={{ span: 6, offset: 4 }}>
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
          </Form.Item> */}
          {/* <Form.Item
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
          </Form.Item> */}
          {/* <Form.Item
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
          </Form.Item> */}
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

@connect(({ userManagement, loading }) => ({
  loading: loading.effects,
  newUserData: userManagement.saveUser,
  menuUserGroup: userManagement.menuData,
}))
export default class NewUser extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      accountLock: 'N',
      roleIds: '',
      alertIds: '',
      alertUserGroups: [
        { label: 'Future Maker', value: '1' },
        { label: 'Future Checker', value: '2' },
        { label: 'Option Maker', value: '3' },
        { label: 'Option Checker', value: '4' },
      ],
    };
  }

  componentDidMount() {
    this.queryLog();
  }

  queryLog = () => {
    const { dispatch } = this.props;
    const params = {};
    dispatch({
      type: 'userManagement/getMenuUserGroup',
      payload: params,
    });
  };

  onCancel = () => {
    // this.props.history.push({
    //   pathname: '/system-management/user-maintenance',
    // });
    this.props.onCancel();
  };

  onChangeLocked = e => {
    if (e.target.checked) {
      this.setState({
        accountLock: 'Y',
      });
    } else {
      this.setState({
        accountLock: 'N',
      });
    }
  };

  onChangeMenuUserGroup = e => {
    console.log('e.target.value=', e.target.value);
    this.setState({
      roleIds: e.target.value,
    });
  };

  onChangeAlertUserGroup = e => {
    console.log('e.target.value=', e.target.value);
    this.setState({
      alertIds: e.target.value,
    });
  };

  onSave = () => {
    const { accountLock, roleIds, alertIds } = this.state;
    this.newUserRef.current.validateFields((err, values) => {
      console.log('values==', values);
      const { dispatch } = this.props;
      const params = {
        userName: values.userName,
        userPwd: values.userPwd,
        roleIds,
        userId: values.userId,
        alertIds,
        accountLock,
      };
      dispatch({
        type: 'userManagement/newUser',
        payload: params,
        callback: () => {
          message.success('save success');
          this.props.onSave();
          //   this.props.history.push({
          //     pathname: '/system-management/user-maintenance',
          //     params: values,
          //   });
        },
      });
    });
  };

  render() {
    const { menuUserGroup } = this.props;
    const { alertUserGroups } = this.state;
    console.log('menuUserGroup=', menuUserGroup);
    return (
      <Fragment>
        <NewFormUser ref={this.newUserRef} />
        <Row>
          <Col offset={4}>
            <Checkbox onChange={this.onChangeLocked}>User Account Locked</Checkbox>
          </Col>
        </Row>
        <ul className={styles.userGroup}>
          <li>
            <h3 className={styles.groupTitle}>
              {formatMessage({ id: 'systemManagement.userMaintenance.menuUserGroup' })}
            </h3>
            <Radio.Group
              options={menuUserGroup}
              defaultValue={['Operator']}
              onChange={this.onChangeMenuUserGroup}
            ></Radio.Group>
          </li>
        </ul>
        <ul className={styles.userGroup}>
          <li>
            <h3 className={styles.groupTitle}>
              {formatMessage({ id: 'systemManagement.userMaintenance.menuUserGroup' })}
            </h3>
            <Radio.Group
              options={alertUserGroups}
              defaultValue={['Future Maker', 'Future Checker']}
              onChange={this.onChangeAlertUserGroup}
            ></Radio.Group>
          </li>
        </ul>
        <Row
          type="flex"
          justify="end"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Col>
            <Button onClick={this.onCancel}>CANCEL</Button>
            <Button type="primary" onClick={this.onSave}>
              SAVE
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
