import React, { Component, Fragment } from 'react';
import { Input, Modal, Select, Table } from 'antd';
import styles from './params.less';

const { Option } = Select;
class SystemParams extends Component {
  state = {
    visible: false,
    dataSource: [
      {
        key: '1',
        index: '1',
        type: '文件服务器参数',
        paramskey: 'file_upload',
        params: '参数值',
        isOpen: '上传文件到fileserver的请求',
        remark: '创建',
      },
      {
        key: '2',
        index: '2',
        type: '文件服务器参数',
        paramskey: 'file_upload',
        params: '参数值',
        isOpen: '上传文件到fileserver的请求',
        remark: '创建',
      },
      {
        key: '3',
        index: '3',
        type: '文件服务器参数',
        paramskey: 'file_upload',
        params: '参数值',
        isOpen: '上传文件到fileserver的请求',
        remark: '创建',
      },
      {
        key: '4',
        index: '4',
        type: '文件服务器参数',
        paramskey: 'file_upload',
        params: '参数值',
        isOpen: '上传文件到fileserver的请求',
        remark: '创建',
      },
      {
        key: '5',
        index: '5',
        type: '文件服务器参数',
        paramskey: 'file_upload',
        params: '参数值',
        isOpen: '上传文件到fileserver的请求',
        remark: '创建',
      },
    ],
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '参数类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '参数key',
        dataIndex: 'paramskey',
        key: 'paramskey',
      },
      {
        title: '参数值',
        dataIndex: 'params',
        key: 'params',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
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
            <div>
              <span>参数类型：</span>
              <Select>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </Select>
            </div>
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

export default SystemParams;
