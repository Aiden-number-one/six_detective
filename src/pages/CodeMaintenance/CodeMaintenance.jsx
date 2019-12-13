import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Button, Input, Modal, Table, Drawer, Pagination } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

// import TableHeader from '@/components/TableHeader';
import styles from './CodeMaintenance.less';
// import { thisExpression } from '@babel/types';

class CodeForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { codeId, dictItemId, dictItemIdName, sortNo } = this.props;
    return (
      <div>
        <Form layout="inline" className={styles.formWrap}>
          <Form.Item label={formatMessage({ id: 'systemManagement.codeMaintenance.codeID' })}>
            {getFieldDecorator('codeId', {
              initialValue: codeId || undefined,
            })(<Input className={styles.inputValue} disabled></Input>)}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'systemManagement.codeMaintenance.subitemID' })}>
            {getFieldDecorator('dictItemId', {
              initialValue: dictItemId || undefined,
            })(<Input className={styles.inputValue}></Input>)}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'systemManagement.codeMaintenance.subitemName' })}>
            {getFieldDecorator('dictItemIdName', {
              initialValue: dictItemIdName || undefined,
            })(<Input className={styles.inputValue}></Input>)}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'systemManagement.codeMaintenance.sequence' })}>
            {getFieldDecorator('sortNo', {
              initialValue: sortNo || undefined,
            })(<Input className={styles.inputValue}></Input>)}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const NewCodeForm = Form.create({})(CodeForm);
@connect(({ codeList, loading }) => ({
  loading: loading.effects,
  getCodeListData: codeList.data,
  getCodeItemListData: codeList.itemData,
}))
class CodeMaintenance extends Component {
  state = {
    codeVisible: false,
    updateCodeItemVisible: false,
    deleteCodeItemVisible: false,
    // eslint-disable-next-line react/no-unused-state
    itemNameValue: '',
    columns: [
      {
        title: formatMessage({ id: 'app.common.number' }),
        dataIndex: 'index',
        key: 'index',
        render: (res, recode, index) => (
          <span>
            {(this.state.itemPage.pageNumber - 1) * this.state.itemPage.pageSize + index + 1}
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'systemManagement.codeMaintenance.subitemID' }),
        dataIndex: 'subitemId',
        key: 'subitemId',
      },
      {
        title: formatMessage({ id: 'systemManagement.codeMaintenance.subitemName' }),
        dataIndex: 'subitemName',
        key: 'subitemName',
      },
      {
        title: formatMessage({ id: 'systemManagement.codeMaintenance.sequence' }),
        dataIndex: 'sequence',
        key: 'sequence',
      },
      {
        title: formatMessage({ id: 'app.common.operation' }),
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
              {formatMessage({ id: 'app.common.modify' })}
            </a>
            <a
              href="#"
              onClick={() => {
                this.deleteCodeItem(res, recode);
              }}
            >
              {formatMessage({ id: 'app.common.delete' })}
            </a>
          </span>
        ),
      },
    ],
    // eslint-disable-next-line key-spacing
    codeColumns: [
      {
        title: formatMessage({ id: 'app.common.number' }),
        dataIndex: 'index',
        key: 'index',
        render: (res, recode, index) => (
          <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
        ),
      },
      {
        title: formatMessage({ id: 'systemManagement.codeMaintenance.codeID' }),
        dataIndex: 'codeId',
        key: 'codeId',
      },
      {
        title: formatMessage({ id: 'systemManagement.codeMaintenance.codeName' }),
        dataIndex: 'codeName',
        key: 'codeName',
      },
    ],
    page: {
      pageNumber: 1,
      pageSize: 10,
    },
    codeId: '',
    itemPage: {
      pageNumber: '1',
      pageSize: '10',
    },
    updateCodeItemParams: {
      codeId: '',
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
        codeId: this.state.codeId,
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
      codeId: `${this.state.codeId}`,
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
    const { dispatch } = this.props;
    this.codeFormRef.current.validateFields((err, values) => {
      const params = {
        codeId: this.state.codeId,
        dictItemId: this.state.updateCodeItemParams.dictItemId,
        updDictItemId: values.dictItemId,
        dictItemIdName: values.dictItemIdName,
        sortNo: values.sortNo,
      };
      dispatch({
        type: 'codeList/updateCodeItem',
        payload: params,
        callback: () => {
          this.queryCodeItemList();
        },
      });
    });
    this.setState({
      updateCodeItemVisible: false,
    });
  };

  updateCodeItemCancel = () => {
    this.setState({
      updateCodeItemVisible: false,
    });
  };

  // 删除
  deleteCodeItem = (res, recode) => {
    const updateCodeItemParams = {
      dictItemId: recode.dictItemId,
    };
    this.setState({
      deleteCodeItemVisible: true,
      updateCodeItemParams,
    });
  };

  deleteCodeItemConfirm = () => {
    const { dispatch } = this.props;
    const params = {
      codeId: this.state.codeId,
      dictItemId: this.state.updateCodeItemParams.dictItemId,
    };
    dispatch({
      type: 'codeList/deleteCodeItem',
      payload: params,
      callback: () => {
        this.queryCodeItemList();
        this.setState({
          deleteCodeItemVisible: false,
        });
      },
    });
  };

  deleteCodeItemCancel = () => {
    this.setState({
      deleteCodeItemVisible: false,
    });
  };

  setServer = () => {};

  handleSubmit = () => {};

  queryCodeList = () => {
    const { dispatch } = this.props;
    const { page } = this.state;
    const params = {
      pageNumber: page.pageNumber.toString(),
      pageSize: page.pageSize.toString(),
      operType: 'codeQuery',
    };
    dispatch({
      type: 'codeList/getCodeList',
      payload: params,
      callback: () => {
        this.setState(
          {
            codeId:
              this.props.getCodeListData.items[0] && this.props.getCodeListData.items[0].codeId,
          },
          () => {
            this.queryCodeItemList();
          },
        );
      },
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

  // pageChange = pagination => {
  //   this.setState(
  //     {
  //       pageNumber: pagination.current,
  //       pageSize: pagination.pageSize,
  //     },
  //     () => {
  //       this.queryCodeList();
  //     },
  //   );
  // };

  onShowSizeChange = (current, pageSize) => {
    const page = {
      pageNumber: current,
      pageSize,
    };
    this.setState(
      {
        // eslint-disable-next-line react/no-unused-state
        page,
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
        codeId: record.codeId,
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
      operType: 'subitemQueryBycodeId',
      pageNumber: `${this.state.itemPage.pageNumber}` || '1',
      pageSize: `${this.state.itemPage.pageSize}` || '10',
      codeId: `${this.state.codeId}`,
    };
    dispatch({
      type: 'codeList/getCodeItemList',
      payload: params,
    });
  };

  render() {
    const { loading, getCodeListData, getCodeItemListData } = this.props;
    const totalCount = getCodeListData && getCodeListData.totalCount;
    const totalCountItem = getCodeItemListData && getCodeItemListData.totalCount;
    const { page, itemPage, updateCodeItemParams } = this.state;

    const codeListData = getCodeListData && getCodeListData.items;
    const codeItemListData = getCodeItemListData && getCodeItemListData.items;
    // eslint-disable-next-line no-unused-expressions
    codeListData &&
      codeListData.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index = (this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1;
      });
    // eslint-disable-next-line no-unused-expressions
    codeItemListData &&
      codeItemListData.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index =
          (this.state.itemPage.pageNumber - 1) * this.state.itemPage.pageSize + index + 1;
      });

    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <div>
              <ul className={styles.clearfix}>
                <li className={styles.fl}>
                  <span>
                    {formatMessage({ id: 'systemManagement.codeMaintenance.codeName' })}：
                  </span>
                  <Input className={styles['login-name']} onChange={this.itemNameChange}></Input>
                </li>
                <li className={styles.fl}>
                  <Button type="primary" icon="search" onClick={this.queryCode}></Button>
                </li>
              </ul>
            </div>
            <div>
              <Table
                loading={loading['codeList/getCodeList']}
                dataSource={codeListData}
                columns={this.state.codeColumns}
                pagination={false}
                onRow={record => ({
                  onClick: () => {
                    this.connectCodeList(record);
                  }, // 点击行
                })}
              ></Table>
              <Pagination
                showSizeChanger
                current={page.pageNumber}
                showTotal={() =>
                  `Page ${(totalCount || 0) && page.pageNumber} of ${Math.ceil(
                    (totalCount || 0) / page.pageSize,
                  ).toString()}`
                }
                onShowSizeChange={this.onShowSizeChange}
                onChange={this.pageChange}
                total={totalCount}
                pageSize={page.pageSize}
              />
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
              {/* <Button
                type="primary"
                onClick={() => {
                  this.addCode();
                }}
              >
                添加
              </Button> */}
              <Drawer
                // drawerStyle={
                //   {
                //     height: '200px',
                //   }
                // }
                closable={false}
                title="新增字典子项"
                width={700}
                onClose={this.codeCancel}
                visible={this.state.codeVisible}
              >
                {this.state.codeVisible && (
                  <NewCodeForm ref={this.codeFormRef} codeId={this.state.codeId}></NewCodeForm>
                )}
              </Drawer>
              {/* <Modal
                title="新增字典子项"
                visible={this.state.codeVisible}
                onOk={this.codeConfirm}
                onCancel={this.codeCancel}
                cancelText={formatMessage({ id: 'app.common.cancel' })}
                okText={formatMessage({ id: 'app.common.save' })}
              >
                <NewCodeForm ref={this.codeFormRef} codeId={this.state.codeId}></NewCodeForm>
              </Modal> */}
              {/* 修改 */}
              <Modal
                title="修改字典子项"
                visible={this.state.updateCodeItemVisible}
                onOk={this.updateCodeItemConfirm}
                onCancel={this.updateCodeItemCancel}
                cancelText={formatMessage({ id: 'app.common.cancel' })}
                okText={formatMessage({ id: 'app.common.save' })}
              >
                <NewCodeForm ref={this.codeFormRef} {...updateCodeItemParams}></NewCodeForm>
              </Modal>
              {/* 删除 */}
              {/* 删除 */}
              <Modal
                title="提示"
                visible={this.state.deleteCodeItemVisible}
                onOk={this.deleteCodeItemConfirm}
                onCancel={this.deleteCodeItemCancel}
                cancelText={formatMessage({ id: 'app.common.cancel' })}
                okText={formatMessage({ id: 'app.common.save' })}
              >
                <div>
                  <span>确定删除吗？</span>
                </div>
              </Modal>
            </div>
            <div className={styles.content}>
              {/* <TableHeader showEdit showSelect addTableData={() => this.addCode()} /> */}
              <div className={styles.tableTop}>
                <Button onClick={this.addCode} type="primary" className="btn_usual">
                  + Add
                </Button>
              </div>
              <Table
                loading={loading['codeList/getCodeItemList']}
                dataSource={codeItemListData}
                pagination={false}
                columns={this.state.columns}
              ></Table>
              <Pagination
                showSizeChanger
                current={itemPage.pageNumber}
                showTotal={() =>
                  `Page ${(totalCountItem || 0) && itemPage.pageNumber} of ${Math.ceil(
                    (totalCountItem || 0) / itemPage.pageSize,
                  ).toString()}`
                }
                onShowSizeChange={this.onShowSizeChange}
                onChange={this.pageChange}
                total={totalCountItem}
                pageSize={itemPage.pageSize}
              />
            </div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default CodeMaintenance;
