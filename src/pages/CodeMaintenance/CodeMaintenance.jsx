import React, { Component, Fragment } from 'react';
import { Form, Button, Input, Modal, Table } from 'antd';
import { connect } from 'dva';

import styles from './code.less';

class CodeForm extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form layout="inline">
          <Form.Item label="字典条目：">
            {getFieldDecorator('dictItem', {})(<Input className={styles['input-value']}></Input>)}
          </Form.Item>
          <Form.Item label="字典子项：">
            {getFieldDecorator('isShow', {})(<Input className={styles['input-value']}></Input>)}
          </Form.Item>
          <Form.Item label="子项名称：">
            {getFieldDecorator('itemName', {})(<Input className={styles['input-value']}></Input>)}
          </Form.Item>
          <Form.Item label="条目排序：">
            {getFieldDecorator('showOrder', {})(<Input className={styles['input-value']}></Input>)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const NewCodeForm = Form.create({})(CodeForm);
@connect(({ codeList, loading }) => ({
  loading: loading.effects['codeList/getCodeList'],
  getCodeListData: codeList.data,
}))
class CodeMaintenance extends Component {
  state = {
    codeVisible: false,
    // eslint-disable-next-line react/no-unused-state
    itemNameValue: '',
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
    codeColumns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '字典条目',
        dataIndex: 'dictItem',
        key: 'dictItem',
      },
      {
        title: '条目名称',
        dataIndex: 'itemName',
        key: 'itemName',
      },
    ],
    pageNumber: 1,
    pageSize: 10,
  };

  codeFormRef = React.createRef();

  componentDidMount() {
    this.queryCodeList();
  }

  addCode = () => {
    this.setState({ codeVisible: true });
  };

  codeConfirm = () => {
    const { dispatch } = this.props;
    this.codeFormRef.current.validateFields((err, values) => {
      const params = {
        dictItem: values.dictItem,
        itemName: values.itemName,
        showOrder: values.showOrder,
        isShow: values.isShow,
      };
      dispatch({
        type: 'codeList/addCode',
        payload: params,
      });
    });
    this.setState({ codeVisible: false });
  };

  codeCancel = () => {
    this.setState({ codeVisible: false });
  };

  handleChange = () => {};

  updateEmail = () => {};

  setServer = () => {};

  handleSubmit = () => {};

  queryCodeList = () => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: this.state.pageNumber || '1',
      pageSize: this.state.pageSize || '10',
      ItemName: this.state.itemNameValue || '',
    };
    dispatch({
      type: 'codeList/getCodeList',
      payload: params,
    });
  };

  itemNameChange = e => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      itemNameValue: e.target.value,
    });
  };

  queryCode = () => {
    this.queryCodeList();
  };

  pageChange = pagination => {
    this.setState(
      {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      },
      () => {
        this.queryCodeList();
      },
    );
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState(
      {
        // eslint-disable-next-line react/no-unused-state
        pageNumber: current,
        pageSize,
      },
      () => {
        this.queryCodeList();
      },
    );
  };

  render() {
    const { getCodeListData } = this.props;
    const totalCount = getCodeListData && getCodeListData.totalCount;
    const { pageSize } = this.state;

    const codeListData = getCodeListData && getCodeListData.items;
    // eslint-disable-next-line no-unused-expressions
    codeListData &&
      codeListData.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index = (this.state.pageNumber - 1) * this.state.pageSize + index + 1;
      });
    return (
      <Fragment>
        <div>
          <div>
            <ul className={styles.clearfix}>
              <li className={styles.fl}>
                <span>条目名称：</span>
                <Input className={styles['login-name']} onChange={this.itemNameChange}></Input>
              </li>
              <li className={styles.fl}>
                <Button type="primary" icon="search" onClick={this.queryCode}></Button>
              </li>
            </ul>
          </div>
          <div>
            <Table
              dataSource={codeListData}
              columns={this.state.codeColumns}
              pagination={{ total: totalCount, pageSize }}
              onChange={this.pageChange}
            ></Table>
            {/* <Pagination
              showSizeChanger
              showQuickJumper
              total={totalCount}
              showTotal={total => `总共${total}条`}
              pageSizeOptions={['5', '10', '20', '30', '40']}
              pageSize={pageSize}
              onChange={this.pageChange}
              onShowSizeChange={this.onShowSizeChange}
            ></Pagination> */}
          </div>
        </div>
        <div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                this.addCode();
              }}
            >
              添加
            </Button>
            <Modal
              title="新增字典子项"
              visible={this.state.codeVisible}
              onOk={this.codeConfirm}
              onCancel={this.codeCancel}
            >
              <NewCodeForm ref={this.codeFormRef}></NewCodeForm>
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
