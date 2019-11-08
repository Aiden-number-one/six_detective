import React, { Component, Fragment } from 'react';

import { Form, Button, Input, Modal, Select, Table } from 'antd';
import { connect } from 'dva';
import styles from './user.less';

const { Option } = Select;

class UserForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
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
              {getFieldDecorator('department', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 所属部门',
                  },
                ],
              })(
                <Select
                  style={{ width: 300 }}
                  onChange={this.handleChange}
                  placeholder="Please select"
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>,
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
              })(<Input.Password className={styles.inputValue} onBlur={this.handleConfirmBlur} />)}
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
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
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
              {getFieldDecorator('department', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 所属部门',
                  },
                ],
              })(
                <Select
                  style={{ width: 300 }}
                  onChange={this.handleChange}
                  placeholder="Please select"
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>,
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
              })(<Input.Password className={styles.inputValue} onBlur={this.handleConfirmBlur} />)}
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
              })(<Input.Password className={styles.inputValue} onBlur={this.handleConfirmBlur} />)}
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
}))
class UserManagement extends Component {
  state = {
    visible: false,
    updateVisible: false,
    lockVisible: false,
    closingVisible: false,
    updatePasswordVisible: false,
    resetPasswordVisible: false,
    // eslint-disable-next-line react/no-unused-state
    userInfo: {
      login: '',
      name: '',
      department: '',
      password: '',
      confirm: '',
      phone: '',
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
        dataIndex: 'custStatusName',
        key: 'custStatusName',
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

  formRef = React.createRef();

  updateFormRef = React.createRef();

  passwordFormRef = React.createRef();

  resetPasswordFormRef = React.createRef();

  // eslint-disable-next-line react/sort-comp
  addUser = () => {
    this.setState({ visible: true });
  };

  // 密码级别
  // eslint-disable-next-line arrow-parens
  passWordStrength = passwd => {
    // 密码强度
    let grade = 0;
    // 判断密码是否存在
    if (!passwd) {
      return grade;
    }
    // 判断长度。并给出分数
    /*
    密码长度：
    0 分: 小于等于 4 个字符
    10 分: 5 到 7 字符
    20 分: 大于8 个字符
    */
    // grade += passwd.length<=4?0:(passwd.length>8?20:10);
    if (passwd.length <= 4) {
      grade += 0;
    } else if (passwd.length > 8) {
      grade += 20;
    } else {
      grade += 10;
    }
    /*
    字母:
    0 分: 没有字母
    10 分: 全都是小（大）写字母
    20 分: 大小写混合字母
    */
    // grade += !passwd.match(/[a-z]/i)?0:(passwd.match(/[a-z]/) && passwd.match(/[A-Z]/)?20:10);
    if (!passwd.match(/[a-z]/i)) {
      grade += 0;
    } else if (passwd.match(/[a-z]/) && passwd.match(/[A-Z]/)) {
      grade += 20;
    } else {
      grade += 10;
    }
    /*
    数字:
    0 分: 没有数字
    10 分: 1 个数字
    15 分: 大于等于 3 个数字
    */
    // grade += !passwd.match(/[0-9]/)?0:(passwd.match(/[0-9]/g).length >= 3?15:10);
    if (!passwd.match(/[0-9]/)) {
      grade += 0;
    } else if (passwd.match(/[0-9]/g).length > 3) {
      grade += 15;
    } else {
      grade += 10;
    }
    /*
    符号:
    0 分: 没有符号
    10 分: 1 个符号
    20 分: 大于 1 个符号
    */
    // grade += !passwd.match(/\W/)?0:(passwd.match(/\W/g).length > 1?20:10);
    if (!passwd.match(/\W/)) {
      grade += 0;
    } else if (passwd.match(/\W/g).length > 1) {
      grade += 20;
    } else {
      grade += 10;
    }
    if (!passwd.match(/(.+)\1{2,}/gi)) {
      grade += 10;
    } else {
      grade += 5;
    }
    /*
    奖励:
    0 分: 只有字母或数字
    5 分: 只有字母和数字
    10 分: 字母、数字和符号
    15 分: 大小写字母、数字和符号
    */
    // eslint-disable-next-line max-len
    // grade += !passwd.match(/[0-9]/) || !passwd.match(/[a-z]/i)?0:(!passwd.match(/\W/)?5:(!passwd.match(/[a-z]/) || !passwd.match(/[A-Z]/)?10:15));
    if (!passwd.match(/[0-9]/) || !passwd.match(/[a-z]/i)) {
      grade += 0;
    } else if (!passwd.match(/\W/)) {
      grade += 5;
    } else if (!passwd.match(/[a-z]/) || !passwd.match(/[A-Z]/)) {
      grade += 10;
    } else {
      grade += 15;
    }
    return grade;
  };

  handleOk = () => {
    // this.setState({ visible: false });
    // console.log('this.form=', this.form)
    const { dispatch } = this.props;
    this.formRef.current.validateFields((err, values) => {
      const passwordStrength = this.passWordStrength(values.password);
      const param = {
        loginName: values.login,
        customerName: values.name,
        departmentId: 1001,
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
    this.updateFormRef.current.validateFields((err, values) => {
      console.log('err, values=', err, values);
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
    console.log('obj=', obj, res);
    this.setState({
      updateVisible: true,
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
      custCustomerno: 3047,
      operationType: 1,
    };
    console.log(11111111112222);
    dispatch({
      type: 'userManagement/operationUserModelDatas',
      payload: param,
      callback: () => {
        console.log('okk');
        this.queryUser({
          customerno: '3047',
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
      custCustomerno: 3047,
      operationType: 3,
    };
    dispatch({
      type: 'userManagement/operationUserModelDatas',
      payload: param,
      callback: () => {
        this.queryUser({
          customerno: '3047',
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
      console.log('err, values=', err, values);
      const passwordStrength = this.passWordStrength(values.password);
      const param = {
        custCustomerno: 3047,
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
      console.log('err, values=', err, values);
      const passwordStrength = this.passWordStrength(values.password);
      const param = {
        custCustomerno: 3047,
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

  componentDidMount() {
    const obj = {
      customerno: '3047',
    };
    this.queryUser(obj);
  }

  render() {
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
              <NewUserForm ref={this.formRef}></NewUserForm>
            </Modal>
            {/* 修改用户 */}
            <Modal
              title="修改用户"
              visible={this.state.updateVisible}
              onOk={this.updateConfirm}
              onCancel={this.updateCancel}
            >
              <NewUpdateForm ref={this.updateFormRef}></NewUpdateForm>
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
              dataSource={this.props.userManagementData}
              columns={this.state.columns}
            ></Table>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default UserManagement;
