import React, { Component, Fragment } from 'react';

import { Form, TreeSelect, Button, Input, Modal, Table } from 'antd';
import { connect } from 'dva';
import styles from './user.less';
import { passWordStrength } from '@/utils/utils';

const { TreeNode } = TreeSelect;

function loop(orgsTree) {
  return orgsTree.map(item => {
    const { children, departmentId, departmentName, parentDepartmentId } = item;
    if (children) {
      return (
        <TreeNode
          key={departmentId}
          departmentId={departmentId}
          value={departmentName}
          title={departmentName}
          parentId={parentDepartmentId}
        >
          {loop(children)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={departmentId}
        departmentId={departmentId}
        value={departmentName}
        title={departmentName}
        parentId={parentDepartmentId}
      />
    );
  });
}

class UserForm extends Component {
  state = {
    selectValue: undefined,
    departmentId: '',
  };

  componentDidUpdate() {
    this.props.getDepartmentId(this.state.departmentId);
  }

  selectChange = (value, node) => {
    this.setState({
      selectValue: value,
      departmentId: node.props.eventKey,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { orgs } = this.props;
    const { selectValue } = this.state;
    return (
      <Fragment>
        <div>
          <Form>
            <Form.Item label="登陆名：">
              {getFieldDecorator('login', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 登陆名',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="员工姓名：">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 员工姓名',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="所属部门：">
              {getFieldDecorator('departmentId', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 所属部门',
                  },
                ],
              })(
                <TreeSelect
                  treeDefaultExpandAll
                  value={selectValue}
                  style={{ width: 300 }}
                  onSelect={this.selectChange}
                  placeholder="Please select"
                >
                  {loop(orgs)}
                </TreeSelect>,
              )}
            </Form.Item>
            <Form.Item label="登陆密码：">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 登陆密码',
                  },
                ],
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="确认密码：">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="联系电话：">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your phone number!',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="邮箱地址：">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please confirm your 邮箱地址!',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
const NewUserForm = Form.create({})(UserForm);

class UpdateForm extends Component {
  state = {
    selectValue: undefined,
    departmentId: '',
  };

  componentDidUpdate() {
    this.props.getDepartmentId(this.state.departmentId);
  }

  selectChange = (value, node) => {
    this.setState({
      selectValue: value,
      departmentId: node.props.eventKey,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { orgs, userInfo } = this.props;
    const { selectValue } = this.state;
    return (
      <Fragment>
        <div>
          <Form>
            <Form.Item label="登陆名：">
              {getFieldDecorator('login', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 登陆名',
                  },
                ],
                initialValue: userInfo.login,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="员工姓名：">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 员工姓名',
                  },
                ],
                initialValue: userInfo.name,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="所属部门：">
              {getFieldDecorator('departmentId', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 所属部门',
                  },
                ],
                initialValue: userInfo.departmentName,
              })(
                <TreeSelect
                  treeDefaultExpandAll
                  value={selectValue}
                  style={{ width: 300 }}
                  onSelect={this.selectChange}
                  placeholder="Please select"
                >
                  {loop(orgs)}
                </TreeSelect>,
              )}
            </Form.Item>
            <Form.Item label="邮箱地址：">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please confirm your 邮箱地址!',
                  },
                ],
                initialValue: userInfo.email,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
const NewUpdateForm = Form.create({})(UpdateForm);

class PasswordForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div>
          <Form>
            <Form.Item label="原密码：">
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 原密码',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="登陆密码：">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 登陆密码',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="确认密码：">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const NewPasswordForm = Form.create({})(PasswordForm);

class ResetPasswordForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div>
          <Form>
            <Form.Item label="登陆密码：">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 登陆密码',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="确认密码：">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const NewResetPasswordForm = Form.create({})(ResetPasswordForm);

@connect(({ userManagement, loading }) => ({
  loading: loading.effects['userManagement/userManagemetDatas'],
  userManagementData: userManagement.data,
  orgs: userManagement.orgs,
}))
class UserManagement extends Component {
  state = {
    visible: false,
    updateVisible: false,
    lockVisible: false,
    closingVisible: false,
    updatePasswordVisible: false,
    resetPasswordVisible: false,
    userInfo: {
      login: '',
      name: '',
      departmentName: '',
      departmentId: '',
      email: '',
    },
    columns: [
      {
        title: '登陆名',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '公司部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
      },
      {
        title: '状态',
        dataIndex: 'custStatus',
        key: 'custStatus',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (res, obj) => (
          <span className={styles.operation}>
            <a href="#" onClick={() => this.updateUser(res, obj)}>
              修改用户
            </a>
            <a href="#" onClick={() => this.lockUser()}>
              锁定
            </a>
            <a href="#" onClick={() => this.closingUser()}>
              销户
            </a>
            <a href="#" onClick={() => this.updatePassword()}>
              密码修改
            </a>
            <a href="#" onClick={() => this.resetPassword()}>
              密码重置
            </a>
          </span>
        ),
      },
    ],
  };

  newDepartmentId = '';

  formRef = React.createRef();

  updateFormRef = React.createRef();

  passwordFormRef = React.createRef();

  resetPasswordFormRef = React.createRef();

  // eslint-disable-next-line react/sort-comp
  addUser = () => {
    this.setState({ visible: true });
  };

  // 获取id
  getDepartmentId = departmentId => {
    this.newDepartmentId = departmentId;
  };

  handleOk = () => {
    const { dispatch } = this.props;
    this.formRef.current.validateFields((err, values) => {
      const passwordStrength = passWordStrength(values.password);
      const param = {
        loginName: values.login,
        customerName: values.name,
        departmentId: this.newDepartmentId,
        password: values.password,
        passwordStrength,
        mobile: values.phone,
        email: values.email,
      };
      dispatch({
        type: 'userManagement/addUserModelDatas',
        payload: param,
      });
    });
  };

  updateConfirm = () => {
    const { dispatch } = this.props;
    this.updateFormRef.current.validateFields((err, values) => {
      const param = {
        custCustomerno: '77029',
        loginName: values.login,
        customerName: values.name,
        departmentId: this.newDepartmentId || this.state.userInfo.departmentId,
        email: values.email,
      };
      dispatch({
        type: 'userManagement/updateUserModelDatas',
        payload: param,
        callback: () => {
          this.queryUser({
            customerno: '77029',
          });
        },
      });
    });
    this.setState({
      updateVisible: false,
    });
  };

  updateCancel = () => {
    this.setState({
      updateVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleChange = () => {};

  updateUser = (res, obj) => {
    const userInfo = {
      login: '',
      name: '',
      departmentName: '',
      departmentId: '',
      email: '',
    };
    userInfo.login = obj.loginName;
    userInfo.name = obj.customerName;
    userInfo.departmentName = obj.departmentName;
    userInfo.departmentId = obj.departmentId;
    userInfo.email = obj.email;
    this.setState({
      updateVisible: true,
      userInfo,
    });
  };

  lockUser = () => {
    this.setState({
      lockVisible: true,
    });
  };

  lockConfirm = () => {
    const { dispatch } = this.props;
    const param = {
      custCustomerno: 77029,
      operationType: 1,
    };
    dispatch({
      type: 'userManagement/operationUserModelDatas',
      payload: param,
      callback: () => {
        this.queryUser({
          customerno: '77029',
        });
      },
    });
    this.setState({
      lockVisible: false,
    });
  };

  lockCancel = () => {
    this.setState({
      lockVisible: false,
    });
  };

  // 销户
  closingUser = () => {
    this.setState({
      closingVisible: true,
    });
  };

  closingConfirm = () => {
    const { dispatch } = this.props;
    const param = {
      custCustomerno: 77029,
      operationType: 3,
    };
    dispatch({
      type: 'userManagement/operationUserModelDatas',
      payload: param,
      callback: () => {
        this.queryUser({
          customerno: '77029',
        });
        this.setState({
          closingVisible: false,
        });
      },
    });
  };

  closingCancel = () => {
    this.setState({
      closingVisible: false,
    });
  };

  // 修改密码
  updatePassword = () => {
    this.setState({
      updatePasswordVisible: true,
    });
  };

  updatePasswordConfirm = () => {
    const { dispatch } = this.props;
    this.passwordFormRef.current.validateFields((err, values) => {
      const passwordStrength = passWordStrength(values.password);
      const param = {
        custCustomerno: 77029,
        operationType: 5,
        oldPassword: values.oldPassword,
        password: values.password,
        passwordStrength,
      };
      dispatch({
        type: 'userManagement/operationUserModelDatas',
        payload: param,
        callback: () => {
          this.setState({
            updatePasswordVisible: false,
          });
        },
      });
    });
  };

  updatePasswordCancel = () => {
    this.setState({
      updatePasswordVisible: false,
    });
  };

  // 重置密码
  resetPassword = () => {
    this.setState({
      resetPasswordVisible: true,
    });
  };

  resetPasswordConfirm = () => {
    const { dispatch } = this.props;
    this.resetPasswordFormRef.current.validateFields((err, values) => {
      const passwordStrength = passWordStrength(values.password);
      const param = {
        custCustomerno: 77029,
        operationType: 6,
        password: values.password,
        passwordStrength,
      };
      dispatch({
        type: 'userManagement/operationUserModelDatas',
        payload: param,
        callback: () => {
          this.setState({
            resetPasswordVisible: false,
          });
        },
      });
    });
  };

  resetPasswordCancel = () => {
    this.setState({
      resetPasswordVisible: false,
    });
  };

  // 获取查询列表数据
  queryUser = param => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userManagement/userManagemetDatas',
      payload: param,
    });
  };

  // 查询部门
  queryDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManagement/queryOrgs',
      params: {
        treeLevel: '2',
      },
    });
  };

  componentDidMount() {
    const obj = {
      customerno: '77029',
    };
    this.queryUser(obj);
    this.queryDepartment();
  }

  render() {
    const { orgs, userManagementData } = this.props;
    const { userInfo } = this.state;

    // let userData = Object.assign([], userManagementData)
    // userData = userData.length > 0 && userData.map(element => {
    //   const newCustStatus = userStatus(element.custStatus);
    //   return {
    //     custStatus: newCustStatus,
    //     custCustomerno: element.custCustomerno,
    //     custStatusName: element.custStatusName,
    //     customerName: element.customerName,
    //     customerno: element.customerno,
    //     departmentId: element.departmentId,
    //     departmentName: element.departmentName,
    //     displaypath: element.displaypath,
    //     email: element.email,
    //     lastupdatetime: element.lastupdatetime,
    //     loginName: element.loginName,
    //   };
    // });
    return (
      <Fragment>
        <div>
          <div>
            <ul className={styles.clearfix}>
              <li className={styles.fl}>
                <span>登陆名：</span>
                <Input className={styles['login-name']}></Input>
              </li>
              <li className={styles.fl}>
                <span>公司部门：</span>
                <Input className={styles['login-name']}></Input>
              </li>
              <li className={styles.fl}>
                <Button type="primary" icon="search"></Button>
              </li>
            </ul>
          </div>
          <div>
            <Button type="primary" onClick={this.addUser}>
              新增用户
            </Button>
            <Modal
              title="新增用户"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <NewUserForm
                ref={this.formRef}
                orgs={orgs}
                getDepartmentId={this.getDepartmentId}
              ></NewUserForm>
            </Modal>
            {/* 修改用户 */}
            <Modal
              title="修改用户"
              visible={this.state.updateVisible}
              onOk={this.updateConfirm}
              onCancel={this.updateCancel}
            >
              <NewUpdateForm
                ref={this.updateFormRef}
                orgs={orgs}
                userInfo={userInfo}
                getDepartmentId={this.getDepartmentId}
              ></NewUpdateForm>
            </Modal>
            {/* 锁定 */}
            <Modal
              title="提示"
              visible={this.state.lockVisible}
              onOk={this.lockConfirm}
              onCancel={this.lockCancel}
            >
              <span>是否锁定？</span>
            </Modal>
            {/* 销户 */}
            <Modal
              title="提示"
              visible={this.state.closingVisible}
              onOk={this.closingConfirm}
              onCancel={this.closingCancel}
            >
              <span>是否销户？</span>
            </Modal>
            {/* 密码修改 */}
            <Modal
              title="密码修改"
              visible={this.state.updatePasswordVisible}
              onOk={this.updatePasswordConfirm}
              onCancel={this.updatePasswordCancel}
            >
              <NewPasswordForm ref={this.passwordFormRef}></NewPasswordForm>
            </Modal>
            {/* 密码重置 */}
            <Modal
              title="密码重置"
              visible={this.state.resetPasswordVisible}
              onOk={this.resetPasswordConfirm}
              onCancel={this.resetPasswordCancel}
            >
              <NewResetPasswordForm ref={this.resetPasswordFormRef}></NewResetPasswordForm>
            </Modal>
          </div>
          <div>
            <Table
              pagination={{ size: 'small' }}
              dataSource={userManagementData}
              columns={this.state.columns}
            ></Table>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default UserManagement;
