import React, { Component, Fragment } from 'react';
import { Button, Input, Modal, Select, Table } from 'antd';
import styles from './email.less';

const { Option } = Select;
class EmailConfig extends Component {
  state = {
    visible: false,
    dataSource: [
      {
        key: '1',
        name: '233',
        server: '192.168.5.22',
        port: 88,
        email: 'zhangsan@sina.com',
        isOpen: '是',
        create: '创建',
        operation: [1, 3],
      },
      {
        key: '2',
        name: '23355',
        server: '192.168.5.22',
        port: 88,
        email: 'zhangsan@sina.com',
        isOpen: '是',
        create: '创建',
      },
      {
        key: '3',
        name: '6233',
        server: '192.168.5.22',
        port: 88,
        email: 'zhangsan@sina.com',
        isOpen: '是',
        create: '创建',
      },
      {
        key: '4',
        name: '8233',
        server: '192.168.5.22',
        port: 88,
        email: 'zhangsan@sina.com',
        isOpen: '是',
        create: '创建',
      },
      {
        key: '5',
        name: '9233',
        server: '192.168.5.22',
        port: 88,
        email: 'zhangsan@sina.com',
        isOpen: '是',
        create: '创建',
      },
    ],
    columns: [
      {
        title: '配置ID',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '服务器IP',
        dataIndex: 'server',
        key: 'server',
      },
      {
        title: '端口',
        dataIndex: 'port',
        key: 'port',
      },
      {
        title: '发件人邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '是否开启',
        dataIndex: 'isOpen',
        key: 'isOpen',
      },
      {
        title: '创建',
        dataIndex: 'create',
        key: 'create',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (res, recode, index, active) => (
          <span className={styles.operation}>
            <a
              href="#"
              onClick={() => {
                this.updateEmail(res, recode, index, active);
              }}
            >
              修改
            </a>
            <a href="#">删除</a>
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

  updateEmail = () => {};

  render() {
    return (
      <Fragment>
        <div>
          <div>
            <Button type="primary" onClick={this.addUser}>
              添加
            </Button>
            <Modal
              title="新增绑定配置"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <ul className={styles['add-user']}>
                <li>
                  <span>服务器IP：</span>
                  <Input className={styles['input-value']}></Input>
                </li>
                <li>
                  <span>端口：</span>
                  <Input className={styles['input-value']}></Input>
                </li>
                <li>
                  <span>发件人邮箱地址：</span>
                  <Input className={styles['input-value']}></Input>
                </li>
                <li>
                  <span>发件人邮箱密码：</span>
                  <Input className={styles['input-value']}></Input>
                </li>
                <li>
                  <span>是否开启：</span>
                  <Select
                    defaultValue="lucy"
                    style={{ width: 300 }}
                    onChange={this.handleChange}
                    placeholder="Please select"
                  >
                    <Option value="jack">开启</Option>
                    <Option value="lucy">关闭</Option>
                  </Select>
                </li>
                <li>
                  <span>备注：</span>
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

export default EmailConfig;
