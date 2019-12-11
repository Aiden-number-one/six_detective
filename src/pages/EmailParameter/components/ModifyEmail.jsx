import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
// import styles from '../AlertUserGroup.less';

// import ClassifyTree from '@/components/ClassifyTree';

class FormUser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { emailObj } = this.props;
    return (
      <Fragment>
        <Form>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.emailParameter.severIP' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('mailHost', {
              rules: [
                {
                  required: true,
                  message: 'Please Input Server IP',
                },
              ],
              initialValue: emailObj && emailObj.mailHost,
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.emailParameter.port' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('mailPort', {
              rules: [
                {
                  required: true,
                  message: 'Please Input Port of Email Sever',
                },
              ],
              initialValue: emailObj && emailObj.mailPort,
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.emailParameter.senderEmailAddress' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('mailAddress', {
              rules: [
                {
                  type: 'email',
                  message: 'Please Input Sender Correct Email Address!',
                },
                {
                  required: true,
                  message: 'Please Input Sender Email Address',
                },
              ],
              initialValue: emailObj && emailObj.mailAddress,
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.emailParameter.senderEmailPassword' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('mailPassword', {
              rules: [
                {
                  required: true,
                  message: 'Please Input Sender Email Password',
                },
              ],
              initialValue: emailObj && emailObj.mailPassword,
            })(<Input.Password />)}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

@connect(({ getEmail, loading }) => ({
  loading: loading.effects,
  updateGroup: getEmail.updateData,
}))
class NewUser extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      // defaultCheckedKeys: [],
    };
  }

  componentDidMount() {
    // const { updateFlag } = this.props;
    // if (updateFlag) {
    //   this.getMenuGrops();
    // }
  }

  onSave = () => {
    const { dispatch, updateFlag } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      console.log('err=======', err);
      if (err) {
        return;
      }
      if (!updateFlag) {
        const param = {
          alertName: values.roleName,
          alertDesc: values.roleDesc,
        };
        // debugger
        dispatch({
          type: 'alertUserGroup/newAlertUser',
          payload: param,
          callback: () => {
            message.success('success');
            //   this.props.history.push({
            //     pathname: '/system-management/menu-user-group',
            //     params: values,
            //   });
            this.props.onSave();
          },
        });
      } else {
        const { groupMenuInfo } = this.props;
        const params = {
          operType: 'modifyById',
          roleId: groupMenuInfo.roleId,
          roleName: values.roleName,
          roleDesc: values.roleDesc,
        };
        dispatch({
          type: 'alertUserGroup/updateUserAlert',
          payload: params,
          callback: () => {
            this.props.onSave();
          },
        });
      }
    });
  };

  render() {
    const { emailObj } = this.props;
    return (
      <Fragment>
        <Row type="flex" justify="end">
          <Col>
            <Button type="primary" onClick={this.onSave}>
              SAVE
            </Button>
          </Col>
        </Row>
        <NewFormUser ref={this.newUserRef} emailObj={emailObj} />
      </Fragment>
    );
  }
}

export default NewUser;
