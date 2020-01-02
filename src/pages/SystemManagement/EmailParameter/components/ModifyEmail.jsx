import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, Checkbox } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { severIPPattern, portPattern } from '@/utils/validate';
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
            {getFieldDecorator('emailHost', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.emailParameter.severIP',
                  })} is missing`,
                },
                {
                  message: `Error: Mis-typed in ${formatMessage({
                    id: 'systemManagement.emailParameter.severIP',
                  })}`,
                  pattern: severIPPattern,
                },
              ],
              initialValue: emailObj && emailObj.emailHost,
            })(<Input placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.emailParameter.port' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('emailPort', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.emailParameter.port',
                  })} is missing`,
                },
                {
                  message: 'The numbers of characters should be between 0 to 65535',
                  pattern: portPattern,
                },
              ],
              initialValue: emailObj && emailObj.emailPort,
            })(<Input placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.emailParameter.senderEmailAddress' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('emailAddress', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.emailParameter.senderEmailAddress',
                  })} is missing`,
                },
                {
                  type: 'email',
                  message: `Error: Mis-typed in ${formatMessage({
                    id: 'systemManagement.emailParameter.senderEmailAddress',
                  })}`,
                },
              ],
              initialValue: emailObj && emailObj.emailAddress,
            })(<Input placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.emailParameter.senderEmailPassword' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('emailPassword', {
              rules: [
                {
                  required: true,
                  message: `${formatMessage({
                    id: 'systemManagement.emailParameter.senderEmailPassword',
                  })} is missing`,
                },
              ],
              initialValue: emailObj && emailObj.emailPassword,
            })(<Input.Password placeholder="Please input" />)}
          </Form.Item>
          <Form.Item label="Forbidden" labelCol={{ span: 6 }} wrapperCol={{ span: 8 }}>
            {getFieldDecorator('status', {
              valuePropName: 'checked',
              initialValue: (emailObj && emailObj.status) === '0' || !emailObj.status,
            })(<Checkbox></Checkbox>)}
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
    // const { dispatch, updateFlag } = this.props;
    const { getEmailListData } = this.props;
    const newEmailListData = Object.assign([], getEmailListData);
    this.newUserRef.current.validateFields((err, values) => {
      console.log('values===', values);
      if (err) {
        return;
      }
      newEmailListData.forEach(element => {
        const paramKey = element.paramKey.split('.')[2];
        console.log();
        switch (paramKey) {
          case 'host':
            element.paramRealValue = values.emailHost;
            break;
          case 'port':
            element.paramRealValue = values.emailPort;
            break;
          case 'username':
            element.paramRealValue = values.emailAddress;
            break;
          case 'password':
            element.paramRealValue = values.emailPassword;
            break;
          case 'status':
            element.paramRealValue = values.status ? '0' : '1';
            break;
          default:
            console.log(1);
        }
        this.props.onSave(newEmailListData);
      });
      this.props.onSave(newEmailListData);
      // if (!updateFlag) {
      //   const param = {
      //     alertName: values.roleName,
      //     alertDesc: values.roleDesc,
      //   };
      //   // debugger
      //   dispatch({
      //     type: 'alertUserGroup/newAlertUser',
      //     payload: param,
      //     callback: () => {
      //       message.success('success');
      //       //   this.props.history.push({
      //       //     pathname: '/system-management/menu-user-group',
      //       //     params: values,
      //       //   });
      //       this.props.onSave();
      //     },
      //   });
      // } else {
      //   const { groupMenuInfo } = this.props;
      //   const params = {
      //     operType: 'modifyById',
      //     roleId: groupMenuInfo.roleId,
      //     roleName: values.roleName,
      //     roleDesc: values.roleDesc,
      //   };
      //   dispatch({
      //     type: 'alertUserGroup/updateUserAlert',
      //     payload: params,
      //     callback: () => {
      //       this.props.onSave();
      //     },
      //   });
      // }
    });
  };

  render() {
    const { emailObj } = this.props;
    return (
      <Fragment>
        <Row type="flex" justify="end">
          <Col>
            <Button type="primary" onClick={this.onSave}>
              {formatMessage({ id: 'app.common.save' })}
            </Button>
          </Col>
        </Row>
        <NewFormUser ref={this.newUserRef} emailObj={emailObj} />
      </Fragment>
    );
  }
}

export default NewUser;
