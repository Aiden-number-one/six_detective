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
            label={formatMessage({ id: 'systemManagement.userMaintenance.menuGroupName' })}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
          >
            {getFieldDecorator('groupName', {
              rules: [
                {
                  required: true,
                  message: 'Please input Name of Menu User Group',
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
              rules: [
                {
                  required: true,
                  message: 'Please input Remark of Menu User Group',
                },
              ],
              initialValue: groupMenuInfo && groupMenuInfo.groupDesc,
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
      btnIds: [],
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
      // const newSelectedKeys = selectedKeys.map(element => element.substring(0, 3));
      // let selectedKeysArray = Object.assign([], selectedKeys);
      // newSelectedKeys.forEach(element => selectedKeysArray.push(element));
      // selectedKeysArray = [...new Set(selectedKeysArray)];
      if (!updateFlag) {
        const param = {
          groupName: values.groupName,
          groupDesc: values.groupDesc,
          menuIds: selectedKeys.join(','),
        };
        dispatch({
          type: 'menuUserGroup/newUserGroup',
          payload: param,
          callback: () => {
            message.success({
              content: 'save success',
              duration: 2,
            });
            //   this.props.history.push({
            //     pathname: '/system-management/menu-user-group',
            //     params: values,
            //   });
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
          menuIds: selectedKeys.join(','),
        };
        dispatch({
          type: 'menuUserGroup/updateUserGroup',
          payload: params,
          callback: () => {
            this.props.onSave(true);
            message.success({
              content: 'save success',
              duration: 2,
            });
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
      type: 'menuUserGroup/updateUserGroup',
      payload: params,
      callback: () => {
        const selectedKeys = this.props.updateGroup.map(element => element.menuId);
        const btnIds = [];
        for (let i = 0; i < selectedKeys.length; i += 1) {
          if (selectedKeys[i].includes('btn')) {
            btnIds.push(selectedKeys.splice(i, 1)[0]);
            i -= 1;
          }
        }
        that.setState({
          selectedKeys,
          btnIds,
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

  onCheck = (selectedKeyss, event, btnIds) => {
    let halfCheckedKeys = [];
    if (typeof event === 'boolean') {
      halfCheckedKeys = [];
    } else {
      halfCheckedKeys = Object.assign([], event.halfCheckedKeys);
    }
    const newSelectedKeys = selectedKeyss.concat(halfCheckedKeys, btnIds);
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
    const { selectedKeys, btnIds } = this.state;
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
                btnIds={btnIds}
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

const menuProps = ({ menu }) => ({
  menuData: menu.menuData,
});

export default connect(menuProps)(NewUser);
