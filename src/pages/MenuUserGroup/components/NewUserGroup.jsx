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
    const { groupMenuInfo } = this.props;
    return (
      <Fragment>
        <Form>
          <Form.Item
            label={formatMessage({ id: 'systemManagement.userMaintenance.name' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('roleName', {
              rules: [
                {
                  required: true,
                  message: 'Please input Name of Menu User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.roleName,
            })(<Input placeholder="Please input" />)}
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
                  message: 'Please input Remark of Menu User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.roleDesc,
            })(<TextArea rows={4} placeholder="Please input" />)}
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

const NewFormUser = Form.create()(FormUser);

@connect(({ menuUserGroup, loading }) => ({
  loading: loading.effects,
  userGroup: menuUserGroup.saveUser,
  updateGroup: menuUserGroup.updateData,
}))
class NewUser extends Component {
  newUserRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      // defaultCheckedKeys: [],
    };
  }

  componentDidMount() {
    const { updateFlag } = this.props;
    if (updateFlag) {
      this.getMenuGrops();
    }
  }

  onCancel = () => {
    // this.props.history.push({
    //   pathname: '/system-management/menu-user-group',
    // });
    this.props.onCancel();
  };

  onSave = () => {
    const { selectedKeys } = this.state;
    const { dispatch, updateFlag } = this.props;
    this.newUserRef.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (selectedKeys.length <= 0) {
        message.warning('Please checked Authorizing access to menus');
        return;
      }
      if (!updateFlag) {
        const param = {
          roleName: values.roleName,
          roleDesc: values.roleDesc,
          menuIds: selectedKeys.join(','),
        };
        dispatch({
          type: 'menuUserGroup/newUserGroup',
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
          menuIds: selectedKeys.join(','),
        };
        dispatch({
          type: 'menuUserGroup/updateUserGroup',
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
      type: 'menuUserGroup/updateUserGroup',
      payload: params,
      callback: () => {
        const selectedKeys = this.props.updateGroup.map(element => element.menuId);
        that.setState({
          selectedKeys,
        });
      },
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
    const newSelectedKeys = selectedKeyss;
    this.setState({
      selectedKeys: newSelectedKeys,
    });
  };

  onAllChecked = newSelectedKeys => {
    this.setState({
      selectedKeys: newSelectedKeys,
    });
  };

  render() {
    const { menuData, groupMenuInfo } = this.props;
    const { selectedKeys } = this.state;
    return (
      <Fragment>
        <NewFormUser ref={this.newUserRef} groupMenuInfo={groupMenuInfo} />
        <ul type="flex" className={styles.userGroup}>
          <li>
            <h3 className={styles.groupTitle}>Authorizing access to menus</h3>
            <div className={styles.treeWraper}>
              <ClassifyTree
                all
                checkable
                onCheck={this.onCheck}
                treeData={menuData}
                checkedKeys={selectedKeys}
                treeKey={{
                  currentKey: 'menuid',
                  currentName: 'menuname',
                  parentKey: 'parentmenuid',
                }}
                onAllChecked={this.onAllChecked}
                onSelect={this.onSelect}
              ></ClassifyTree>
            </div>
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

const menuProps = ({ menu }) => ({
  menuData: menu.menuData,
});

export default connect(menuProps)(NewUser);
