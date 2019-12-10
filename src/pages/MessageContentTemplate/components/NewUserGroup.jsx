import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
// import styles from '../AlertUserGroup.less';

// import ClassifyTree from '@/components/ClassifyTree';

const { TextArea } = Input;
class FormUser extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { groupMenuInfo } = this.props;
    return (
      <Fragment>
        <Form>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateName' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('templateName', {
              rules: [
                {
                  required: true,
                  message: 'Please input Name of Alert User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.templateName,
            })(<Input disabled placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateId' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('templateId', {
              initialValue: groupMenuInfo && groupMenuInfo.templateId,
            })(<Input disabled placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateType' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: 'Please input Name of Alert User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.type,
            })(<Input placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateTitle' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please input Name of Alert User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.title,
            })(<Input placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.templateContent' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: 'Please input Name of Alert User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.content,
            })(<TextArea rows={8} placeholder="Please input" />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.template.keyword' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('keyWord', {
              rules: [
                {
                  required: true,
                  message: 'Please input Name of Alert User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.keyWord,
            })(<Input placeholder="Please input" />)}
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

  onCancel = () => {
    // this.props.history.push({
    //   pathname: '/system-management/menu-user-group',
    // });
    this.props.onCancel();
  };

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

  getMenuGrops = () => {
    const { dispatch, groupMenuInfo } = this.props;
    const that = this;
    const params = {
      operType: 'queryById',
      roleId: groupMenuInfo.roleId,
    };
    dispatch({
      type: 'alertUserGroup/updateUserGroup',
      payload: params,
      callback: () => {
        const selectedKeys = this.props.updateGroup.map(element => element.menuId);
        that.setState({
          selectedKeys,
        });
      },
    });
  };

  render() {
    const { groupMenuInfo } = this.props;
    return (
      <Fragment>
        <NewFormUser ref={this.newUserRef} groupMenuInfo={groupMenuInfo} />
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

export default NewUser;
