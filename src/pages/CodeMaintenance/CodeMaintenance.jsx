import React, { Component, Fragment } from 'react';
import { Form, Button, Input, Modal, Select, Table } from 'antd';
import { connect } from 'dva';

import styles from './code.less';

const { Option } = Select;

@connect(({ codeList, loading }) => ({
  loading: loading.effects['codeList/getCodeList'],
  getCodeListData: codeList.data,
}))
class CodeMaintenance extends Component {
  state = {
    visible: false,
    dataSource: [
      {
        key: '1',
        index: '1',
        dictionaryItem: '233',
        itemName: '192.168.5.22',
        itemSort: 88,
        operation: [1, 3],
      },
      {
        key: '2',
        index: '1',
        dictionaryItem: '233',
        itemName: '192.168.5.22',
        itemSort: 88,
      },
      {
        key: '3',
        index: '1',
        dictionaryItem: '233',
        itemName: '192.168.5.22',
        itemSort: 88,
      },
      {
        key: '4',
        index: '1',
        dictionaryItem: '233',
        itemName: '192.168.5.22',
        itemSort: 88,
      },
      {
        key: '5',
        index: '1',
        dictionaryItem: '233',
        itemName: '192.168.5.22',
        itemSort: 88,
      },
      {
        key: '6',
        index: '1',
        dictionaryItem: '233',
        itemName: '192.168.5.22',
        itemSort: 88,
      },
      {
        key: '7',
        index: '1',
        dictionaryItem: '233',
        itemName: '192.168.5.22',
        itemSort: 88,
      },
    ],
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '字典子项',
        dataIndex: 'dictionaryItem',
        key: 'dictionaryItem',
      },
      {
        title: '子项名称',
        dataIndex: 'itemName',
        key: 'itemName',
      },
      {
        title: '子项排序',
        dataIndex: 'itemSort',
        key: 'itemSort',
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
    // eslint-disable-next-line key-spacing
    codeDataSource: [
      {
        key: '1',
        index: 1,
        dictionaryEntry: '1013',
        entryName: '报表类型',
      },
      {
        key: '2',
        index: 2,
        dictionaryEntry: '1014',
        entryName: '报表类型4',
      },
      {
        key: '3',
        index: 3,
        dictionaryEntry: '1015',
        entryName: '报表类型5',
      },
    ],
    codeColumns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '字典条目',
        dataIndex: 'dictionaryEntry',
        key: 'dictionaryEntry',
      },
      {
        title: '条目名称',
        dataIndex: 'entryName',
        key: 'entryName',
      },
    ],
  };

  componentDidMount() {
    this.queryCodeList();
  }

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

  setServer = () => {};

  handleSubmit = () => {};

  queryCodeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'codeList/getCodeList',
      payload: {},
    });
  };

  render() {
    return (
      <Fragment>
        <div>
          <div>
            <ul className={styles.clearfix}>
              <li className={styles.fl}>
                <span>条目名称：</span>
                <Input className={styles['login-name']}></Input>
              </li>
              <li className={styles.fl}>
                <Button type="primary" icon="search"></Button>
              </li>
            </ul>
          </div>
          <div>
            <Table
              dataSource={this.state.codeDataSource}
              pagination={{ size: 'small', pageSize: 5 }}
              columns={this.state.codeColumns}
            ></Table>
          </div>
        </div>
        <div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                this.addUser();
              }}
            >
              添加
            </Button>
            <Modal
              title="新增绑定配置"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div>
                <Form onSubmit={this.handleSubmit}>
                  {/* <ul className={styles['add-user']}> */}
                  <Form.Item label="服务器IP：">
                    {/* <li> */}
                    {/* <span>服务器IP：</span> */}
                    <Input className={styles['input-value']}></Input>
                    {/* </li> */}
                  </Form.Item>
                  <Form.Item label="端口：">
                    {/* <li> */}
                    {/* <span>端口：</span> */}
                    <Input className={styles['input-value']}></Input>
                    {/* </li> */}
                  </Form.Item>
                  <Form.Item label="发件人邮箱地址：">
                    {/* <li> */}
                    {/* <span>发件人邮箱地址：</span> */}
                    <Input className={styles['input-value']}></Input>
                    {/* </li> */}
                  </Form.Item>
                  <Form.Item label="发件人邮箱密码：">
                    {/* <li> */}
                    {/* <span>发件人邮箱密码：</span> */}
                    <Input className={styles['input-value']}></Input>
                    {/* </li> */}
                  </Form.Item>
                  <Form.Item label="是否开启：">
                    {/* <li> */}
                    {/* <span>是否开启：</span> */}
                    <Select
                      defaultValue="lucy"
                      style={{ width: 300 }}
                      onChange={this.handleChange}
                      placeholder="Please select"
                    >
                      <Option value="jack">开启</Option>
                      <Option value="lucy">关闭</Option>
                    </Select>
                    {/* </li> */}
                  </Form.Item>
                  <Form.Item label="备注：">
                    {/* <li> */}
                    {/* <span>备注：</span> */}
                    <Input className={styles['input-value']}></Input>
                    {/* </li> */}
                  </Form.Item>
                  {/* </ul> */}
                </Form>
              </div>
            </Modal>
          </div>
          <div>
            <Table
              dataSource={this.state.dataSource}
              pagination={{ size: 'small', pageSize: 5 }}
              columns={this.state.columns}
            ></Table>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CodeMaintenance;
