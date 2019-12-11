import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, Checkbox, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import styles from '../UserManagement.less';
// import { passWordStrength } from '@/utils/utils';

class FormUser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    // const { alertUserGroups } = this.state;
    const { NewFlag, userInfo } = this.props;
    return (
      <Fragment>
        <Form>
          <Form.Item label="User Id：" labelCol={{ span: 4 }} wrapperCol={{ span: 7 }}>
            {getFieldDecorator('userId', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({ id: 'app.common.userId' })} should not be empty`,
                },
              ],
              initialValue: userInfo && userInfo.userId,
            })(
              <Input
                disabled={!!userInfo.userId}
                placeholder={`Please input ${formatMessage({ id: 'app.common.userId' })}`}
              />,
            )}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.common.username' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 7 }}
          >
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({ id: 'app.common.username' })} should not be empty`,
                },
              ],
              initialValue: userInfo && userInfo.userName,
            })(
              <Input
                placeholder={`Please Input ${formatMessage({ id: 'app.common.username' })}`}
              />,
            )}
          </Form.Item>
          {NewFlag && (
            <Form.Item
              label={formatMessage({ id: 'app.common.password' })}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 7 }}
            >
              {getFieldDecorator('userPwd', {
                rules: [
                  {
                    required: true,
                    message: `Please input ${formatMessage({ id: 'app.common.password' })}`,
                  },
                ],
              })(
                <Input.Password
                  placeholder={`Please Input ${formatMessage({ id: 'app.common.password' })}`}
                />,
              )}
            </Form.Item>
          )}
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
  alertUserGroups: userManagement.alertData,
  modifyUserData: userManagement.updateData,
}))
export default class NewUser extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      accountLock: 'N',
      locedChecked: false,
      groupIds: [],
      alertIds: [],
    };
  }

  componentDidMount() {
    const { userInfo } = this.props;
    let locedChecked = false;
    if (userInfo.accountLock && userInfo.accountLock !== 'N') {
      locedChecked = true;
    }
    this.queryLog();
    this.getAlertUserGroup();
    this.setState({
      locedChecked,
    });
    if (userInfo.userId) {
      this.getRoalId(userInfo.userId);
    }
  }

  queryLog = () => {
    const { dispatch } = this.props;
    const params = {};
    dispatch({
      type: 'userManagement/getMenuUserGroup',
      payload: params,
    });
  };

  getAlertUserGroup = () => {
    const { dispatch } = this.props;
    const params = {};
    dispatch({
      type: 'userManagement/getAlertUserGroup',
      payload: params,
    });
  };

  getRoalId = userId => {
    const { dispatch } = this.props;
    const params = {
      operType: 'queryById',
      userId,
    };
    // const _self = this
    dispatch({
      type: 'userManagement/updateUserModelDatas',
      payload: params,
      callback: () => {
        const groupIds = this.props.modifyUserData.map(element => {
          let groupId = '';
          if (element.userGroupType === 'MENU') {
            // eslint-disable-next-line prefer-destructuring
            groupId = element.groupId;
          }
          return groupId;
        });
        const alertIds = this.props.modifyUserData.map(element => {
          let groupId = '';
          if (element.userGroupType === 'ALERT') {
            // eslint-disable-next-line prefer-destructuring
            groupId = element.groupId;
          }
          return groupId;
        });
        this.setState({
          groupIds,
          alertIds,
        });
      },
    });
  };

  setRoleIds = modifyUserData => {
    if (modifyUserData.length <= 0) return;
    const groupIds = [];
    groupIds.push(modifyUserData[0].groupId);
    this.setState({
      groupIds,
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
        locedChecked: true,
      });
    } else {
      this.setState({
        accountLock: 'N',
        locedChecked: false,
      });
    }
  };

  onChangeMenuUserGroup = checkedValue => {
    this.setState({
      groupIds: checkedValue,
    });
  };

  onChangeAlertUserGroup = checkedValue => {
    this.setState({
      alertIds: checkedValue,
    });
  };

  onSave = () => {
    const { accountLock, groupIds, alertIds } = this.state;
    const { NewFlag } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (groupIds.length <= 0) {
        message.warning('Please checked Menu User Group');
        return;
      }
      if (alertIds.length <= 0) {
        message.warning('Please checked Alert User Group');
        return;
      }
      // const passwordStrength = passWordStrength(values.userPwd);
      const { dispatch } = this.props;
      if (NewFlag) {
        const params = {
          userName: values.userName,
          userPwd: window.kddes.getDes(values.userPwd),
          groupIds: groupIds.join(','),
          userId: values.userId,
          alertIds: alertIds.join(','),
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
      } else {
        const params = {
          operType: 'updateUserById',
          userName: values.userName,
          groupIds: groupIds.join(','),
          userId: values.userId,
          alertIds: alertIds.join(','),
          accountLock,
        };
        dispatch({
          type: 'userManagement/updateUserModelDatas',
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
      }
    });
  };

  render() {
    const { menuUserGroup, NewFlag, userInfo, alertUserGroups } = this.props;
    const { locedChecked, groupIds, alertIds } = this.state;
    return (
      <Fragment>
        <NewFormUser ref={this.newUserRef} NewFlag={NewFlag} userInfo={userInfo} />
        <Row>
          <Col offset={4}>
            <Checkbox onChange={this.onChangeLocked} checked={locedChecked}>
              User Account Locked
            </Checkbox>
          </Col>
        </Row>
        <ul className={styles.userGroup}>
          <li>
            <h3 className={styles.groupTitle}>
              {formatMessage({ id: 'systemManagement.userMaintenance.menuUserGroup' })}
            </h3>
            <Checkbox.Group
              options={menuUserGroup}
              defaultValue={['Operator']}
              onChange={this.onChangeMenuUserGroup}
              value={groupIds}
            ></Checkbox.Group>
          </li>
        </ul>
        <ul className={styles.userGroup}>
          <li>
            <h3 className={styles.groupTitle}>
              {formatMessage({ id: 'systemManagement.userMaintenance.alertUserGroup' })}
            </h3>
            <Checkbox.Group
              options={alertUserGroups}
              defaultValue={['Future Maker', 'Future Checker']}
              onChange={this.onChangeAlertUserGroup}
              value={alertIds}
            ></Checkbox.Group>
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
