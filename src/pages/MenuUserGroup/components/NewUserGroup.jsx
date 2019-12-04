import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Form, Input, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import styles from '../MenuUserGroup.less';

import ClassifyTree from '@/components/ClassifyTree';

const { TextArea } = Input;
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
          <Form.Item
            label={formatMessage({ id: 'app.common.username' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('roleName', {
              rules: [
                {
                  required: true,
                  message: 'Please input your roleName',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.userGroup.remark' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('roleDesc', {
              rules: [
                {
                  required: true,
                  message: 'Please input your remark',
                },
              ],
            })(<TextArea rows={4} />)}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

// @connect(({ userGroup, loading }) => ({
//   loading: loading.effects,
//   userGroup: userGroup.saveUser,
// }))
class NewUser extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
  }

  onCancel = () => {
    // this.props.history.push({
    //   pathname: '/system-management/menu-user-group',
    // });
    this.props.onCancel();
  };

  onSave = () => {
    const { selectedKeys } = this.state;
    const { dispatch } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      const param = {
        roleName: values.roleName,
        roleDesc: values.roleDesc,
        menuIds: selectedKeys,
      };
      dispatch({
        type: 'userGroup/newUserGroup',
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
    });
  };

  onChangeMenuUserGroup = checkedValues => {
    console.log('checkedValues=', checkedValues);
  };

  onChangeAlertUserGroup = checkedValues => {
    console.log('checkedValues=', checkedValues);
  };

  onSelect = value => {
    console.log('value===', value);
  };

  onCheck = selectedKeyss => {
    const newSelectedKeys = selectedKeyss.join(',');
    this.setState({
      selectedKeys: newSelectedKeys,
    });
  };

  render() {
    const { menuData } = this.props;
    console.log('menuData=', menuData);
    return (
      <Fragment>
        <NewFormUser ref={this.newUserRef} />
        <Row type="flex">
          <Col>
            <span className={styles.title}>
              {formatMessage({ id: 'systemManagement.userMaintenance.menuUserGroup' })}
            </span>
          </Col>
          <Col>
            <ClassifyTree
              all
              checkable
              onCheck={this.onCheck}
              treeData={menuData}
              treeKey={{
                currentKey: 'menuid',
                currentName: 'menuname',
                parentKey: 'parentmenuid',
              }}
              onSelect={this.onSelect}
            ></ClassifyTree>
          </Col>
        </Row>
        <Row type="flex" justify="end">
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

const menuProps = ({ menu }) => ({
  menuData: menu.menuData,
});

export default connect(menuProps)(NewUser);
