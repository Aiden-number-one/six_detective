import React, { Component, Fragment } from 'react';
import { Form, Button, Input, Modal, Table } from 'antd';
import { connect } from 'dva';

import styles from './code.less';
// import { thisExpression } from '@babel/types';

class CodeForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dictId, dictItemId, dictItemIdName, sortNo } = this.props;
    return (
      <div>
        <Form layout="inline">
          <Form.Item label="字典条目：">
            {getFieldDecorator('dictId', {
              initialValue: dictId || undefined,
            })(<Input className={styles['input-value']}></Input>)}
          </Form.Item>
          <Form.Item label="字典子项：">
            {getFieldDecorator('dictItemId', {
              initialValue: dictItemId || undefined,
            })(<Input className={styles['input-value']}></Input>)}
          </Form.Item>
          <Form.Item label="子项名称：">
            {getFieldDecorator('dictItemIdName', {
              initialValue: dictItemIdName || undefined,
            })(<Input className={styles['input-value']}></Input>)}
          </Form.Item>
          <Form.Item label="条目排序：">
            {getFieldDecorator('sortNo', {
              initialValue: sortNo || undefined,
            })(<Input className={styles['input-value']}></Input>)}
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
  getCodeItemListData: codeList.itemData,
}))
class CodeMaintenance extends Component {
  state = {
    codeVisible: false,
    updateCodeItemVisible: false,
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
        dataIndex: 'dictItemId',
        key: 'dictItemId',
      },
      {
        title: '子项名称',
        dataIndex: 'dictItemIdName',
        key: 'dictItemIdName',
      },
      {
        title: '子项排序',
        dataIndex: 'sortNo',
        key: 'sortNo',
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
                this.updateCode(res, recode, index, active);
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
        dataIndex: 'dictId',
        key: 'dictId',
      },
      {
        title: '条目名称',
        dataIndex: 'dictIdName',
        key: 'dictIdName',
      },
    ],
    pageNumber: '1',
    pageSize: '10',
    dictId: '',
    itemPage: {
      pageNum: '1',
      pageSize: '10',
    },
    updateCodeItemParams: {
      dictId: '',
      dictItemId: '',
      dictItemIdName: '',
      sortNo: '',
    },
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
        dictId: this.state.dictId,
        dictItemId: values.dictItemId,
        dictItemIdName: values.dictItemIdName,
        sortNo: values.sortNo,
      };
      dispatch({
        type: 'codeList/addCodeItem',
        payload: params,
        callback: () => {
          this.queryCodeItemList();
        },
      });
    });
    this.setState({ codeVisible: false });
  };

  codeCancel = () => {
    this.setState({ codeVisible: false });
  };

  handleChange = () => {};

  updateCode = (res, recode) => {
    const newUpdateCodeItemParams = {
      // eslint-disable-next-line react/no-access-state-in-setstate
      dictId: `${this.state.dictId}`,
      dictItemId: recode.dictItemId,
      dictItemIdName: recode.dictItemIdName,
      sortNo: recode.sortNo,
    };
    this.setState({
      updateCodeItemVisible: true,
      // eslint-disable-next-line react/no-unused-state
      updateCodeItemParams: newUpdateCodeItemParams,
    });
  };

  updateCodeItemConfirm = () => {
    this.setState({
      updateCodeItemVisible: false,
    });
  };

  updateCodeItemCancel = () => {
    this.setState({
      updateCodeItemVisible: false,
    });
  };

  setServer = () => {};

  handleSubmit = () => {};

  queryCodeList = () => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: `${this.state.pageNumber}` || '1',
      pageSize: `${this.state.pageSize}` || '10',
      dictIdName: this.state.itemNameValue || '',
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

  connectCodeList = record => {
    this.setState(
      {
        // eslint-disable-next-line no-underscore-dangle
        dictId: record.dictId,
      },
      () => {
        this.queryCodeItemList();
      },
    );
  };

  // 字典子项)
  queryCodeItemList = () => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: `${this.state.itemPage.pageNum}` || '1',
      pageSize: `${this.state.itemPage.pageSize}` || '10',
      dictId: `${this.state.dictId}`,
    };
    dispatch({
      type: 'codeList/getCodeItemList',
      payload: params,
    });
  };

  render() {
    const { getCodeListData, getCodeItemListData } = this.props;
    const totalCount = getCodeListData && getCodeListData.totalCount;
    const totalCountItem = getCodeItemListData && getCodeItemListData.totalCount;
    const { pageSize, updateCodeItemParams } = this.state;

    const codeListData = getCodeListData && getCodeListData.items;
    const codeItemListData = getCodeItemListData && getCodeItemListData.items;
    // eslint-disable-next-line no-unused-expressions
    codeListData &&
      codeListData.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index = (this.state.pageNumber - 1) * this.state.pageSize + index + 1;
      });
    // eslint-disable-next-line no-unused-expressions
    codeItemListData &&
      codeItemListData.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index =
          (this.state.itemPage.pageNum - 1) * this.state.itemPage.pageSize + index + 1;
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
              onRow={record => ({
                onClick: () => {
                  this.connectCodeList(record);
                }, // 点击行
              })}
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
              <NewCodeForm ref={this.codeFormRef} dictId={this.state.dictId}></NewCodeForm>
            </Modal>
            <Modal
              title="修改字典子项"
              visible={this.state.updateCodeItemVisible}
              onOk={this.updateCodeItemConfirm}
              onCancel={this.updateCodeItemCancel}
            >
              <NewCodeForm ref={this.codeFormRef} {...updateCodeItemParams}></NewCodeForm>
            </Modal>
          </div>
          <div>
            <Table
              dataSource={codeItemListData}
              pagination={{ total: totalCountItem, pageSize: 10 }}
              columns={this.state.columns}
            ></Table>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CodeMaintenance;
