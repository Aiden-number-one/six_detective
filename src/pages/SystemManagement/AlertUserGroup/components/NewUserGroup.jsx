/*
 * @Description: This is setting auth for Alert User.
 * @Author: dailinbo
 * @Date: 2019-12-24 15:14:56
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-19 16:47:17
 */
import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from '../AlertUserGroup.less';

const { TextArea } = Input;
class FormUser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { groupMenuInfo, updateFlag, getAlertData } = this.props;
    return (
      <Fragment>
        <Form className={styles['modify-alert']}>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.userMaintenance.alertGroupName' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('groupName', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.userMaintenance.alertGroupName',
                  })} is missing`,
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.groupName,
            })(<Input placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.userGroup.remark' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('groupDesc', {
              // rules: [
              //   {
              //     required: true,
              //     message: `${formatMessage({
              //       id: 'systemManagement.userGroup.remark',
              //     })} is missing`,
              //   },
              // ],
              initialValue: groupMenuInfo && groupMenuInfo.groupDesc,
            })(<TextArea rows={4} placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.userGroup.groupMember' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {updateFlag && (
              <Fragment>
                <ul className={styles.groupAlert}>
                  {getAlertData &&
                    getAlertData.map(item => <li key={item.userId}>{item.userName}</li>)}
                </ul>
              </Fragment>
            )}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

@connect(({ alertUserGroup, loading }) => ({
  loading: loading.effects,
  userGroup: alertUserGroup.saveUser,
  updateGroup: alertUserGroup.updateData,
  getAlertData: alertUserGroup.getAlertData,
}))
class NewUser extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { updateFlag } = this.props;
    if (updateFlag) {
      this.getAlertDataList();
    }
  }

  onCancel = () => {
    this.props.onCancel();
  };

  onSave = () => {
    const { dispatch, updateFlag } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!updateFlag) {
        const param = {
          alertName: values.groupName,
          alertDesc: values.groupDesc,
        };
        dispatch({
          type: 'alertUserGroup/newAlertUser',
          payload: param,
          callback: () => {
            message.success('success');
            this.props.onSave(false);
          },
        });
      } else {
        const { groupMenuInfo } = this.props;
        const params = {
          operType: 'modifyById',
          groupId: groupMenuInfo.groupId,
          groupName: values.groupName,
          groupDesc: values.groupDesc,
        };
        dispatch({
          type: 'alertUserGroup/updateUserAlert',
          payload: params,
          callback: () => {
            message.success('success');
            this.props.onSave(true);
          },
        });
      }
    });
  };

  getMenuGrops = () => {
    const { dispatch, groupMenuInfo } = this.props;
    const that = this;
    const params = {
      operType: 'queryById',
      groupId: groupMenuInfo.groupId,
    };
    dispatch({
      type: 'alertUserGroup/updateUserGroup',
      payload: params,
      callback: () => {
        const selectedKeys = this.props.updateGroup.map(item => item.menuId);
        that.setState({
          selectedKeys,
        });
      },
    });
  };

  /**
   * @description: This is function for get Alert list.
   * @param {type} null
   * @return: undefined.
   */
  getAlertDataList = () => {
    const { dispatch, groupMenuInfo } = this.props;
    const params = {
      alertId: groupMenuInfo.groupId,
    };
    dispatch({
      type: 'alertUserGroup/getAlertUserList',
      payload: params,
    });
  };

  render() {
    const { groupMenuInfo, updateFlag, getAlertData } = this.props;
    return (
      <Fragment>
        <NewFormUser
          ref={this.newUserRef}
          groupMenuInfo={groupMenuInfo}
          updateFlag={updateFlag}
          getAlertData={getAlertData}
        />
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
            <Button onClick={this.onCancel}>{formatMessage({ id: 'app.common.cancel' })}</Button>
            <Button type="primary" onClick={this.onSave} style={{ marginLeft: '10px' }}>
              {formatMessage({ id: 'app.common.save' })}
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default NewUser;
