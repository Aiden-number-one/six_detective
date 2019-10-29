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
              })(<Input className={styles['input-value']} />)}
            </Form.Item>
            <Form.Item label="员工姓名：">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your 员工姓名',
                  },
                ],
              })(<Input className={styles['input-value']} />)}
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
                  defaultValue="lucy"
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
              })(<Input className={styles['input-value']} />)}
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
              })(
                <Input.Password
                  className={styles['input-value']}
                  onBlur={this.handleConfirmBlur}
                />,
              )}
            </Form.Item>
            <Form.Item label="联系电话：">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your phone number!',
                  },
                ],
              })(<Input.Password className={styles['input-value']} />)}
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
                    message: 'Please confirm your 联系电话!',
                  },
                ],
              })(<Input className={styles['input-value']} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
const NewUserForm = Form.create({})(UserForm);

@connect(({ userManagement, loading }) => ({
  loading: loading.effects['userManagement/userManagemetDatas'],
  userManagementData: userManagement.data,
}))
class UserManagement extends Component {
  state = {
    visible: false,
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
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '公司部门',
        dataIndex: 'departments',
        key: 'departments',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (res, recode) => (
          <span className={styles.operation}>
            <a href="#" onClick={this.updateUser(res, recode)}>
              修改用户
            </a>
            <a href="#">锁定用户</a>
            <a href="#">密码修改</a>
            <a href="#">密码重置</a>
          </span>
        ),
      },
    ],
  };

  formRef = React.createRef();

  // eslint-disable-next-line react/sort-comp
  addUser = () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    // this.setState({ visible: false });
    // console.log('this.form=', this.form)
    const { dispatch } = this.props;
    this.formRef.current.validateFields((err, values) => {
      console.log('names=', err);
      console.log('values=', values);
      const param = {
        login: values.login,
        name: values.name,
        department: values.department,
        password: values.password,
        confirm: values.confirm,
        phone: values.phone,
        email: values.email,
      };
      dispatch({
        type: 'userManagement/addUserModelDatas',
        payload: param,
      });
      // const newUserInfo = {
      // login: '',
      // name: '',
      // department: '',
      // password: '',
      // confirm: '',
      // phone: '',
      // email: '',
      // };
      // newUserInfo.login = values.login;
      // newUserInfo.name = values.name;
      // newUserInfo.department = values.department;
      // newUserInfo.password = values.password;
      // newUserInfo.confirm = values.confirm;
      // newUserInfo.phone = values.phone;
      // newUserInfo.email = values.email;

      // this.setState({
      //   // eslint-disable-next-line react/no-unused-state
      //   userInfo: newUserInfo,
      // }, () => {
      //   console.log('userInfo=', this.state.userInfo)
      // });
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleChange = () => {};

  updateUser = () => {};

  // 获取查询列表数据
  checkData = param => {
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
    this.checkData(obj);
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
          </div>
          <div>
            <Table dataSource={this.props.userManagementData} columns={this.state.columns}></Table>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default UserManagement;
