import React, { Component, Fragment } from 'react';

import { Button, Input, Modal, Select, Table } from 'antd';
import styles from './user.less';

const { Option } = Select;
class UserManagement extends Component {
  state = {
    visible: false,
    dataSource: [
      {
        key: '1',
        name: '张三',
        email: 'zhangsan@sina.com',
        departments: '技术部',
        status: '正常',
      },
      {
        key: '2',
        name: '李四',
        email: 'zhangsan@sina.com',
        departments: '技术部',
        status: '正常',
      },
      {
        key: '3',
        name: '王五',
        email: 'zhangsan@sina.com',
        departments: '技术部',
        status: '正常',
      },
      {
        key: '4',
        name: '赵六',
        email: 'zhangsan@sina.com',
        departments: '技术部',
        status: '正常',
      },
      {
        key: '5',
        name: '田七',
        email: 'zhangsan@sina.com',
        departments: '技术部',
        status: '正常',
      },
    ],
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

  addUser = () => {
    this.setState({ visible: true });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleChange = () => {};

  updateUser = () => {};

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
              <ul className={styles['add-user']}>
                <li>
                  <span>登录名：</span>
                  <Input className={styles['input-value']}></Input>
                </li>
                <li>
                  <span>员工姓名：</span>
                  <Input className={styles['input-value']}></Input>
                </li>
                <li>
                  <span>所属部门：</span>
                  <Select
                    defaultValue="lucy"
                    style={{ width: 300 }}
                    onChange={this.handleChange}
                    placeholder="Please select"
                  >
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>
                </li>
                <li>
                  <span>邮箱地址：</span>
                  <Input className={styles['input-value']}></Input>
                </li>
              </ul>
            </Modal>
          </div>
          <div>
            <Table dataSource={this.state.dataSource} columns={this.state.columns}></Table>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default UserManagement;
