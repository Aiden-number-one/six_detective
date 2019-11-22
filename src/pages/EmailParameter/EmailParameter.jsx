import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Modal, Select, Table } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './EmailParameter.less';
import KdTable from '@/components/KdTable';
import generatePersons from '@/components/KdTable/genData';
import TableHeader from '@/components/TableHeader';
import CustomizePagination from '@/components/CustomizePagination';

const { Option } = Select;
class AddForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div>
          <Form layout="inline" className={styles.formWrap}>
            <Form.Item label={formatMessage({ id: 'systemManagement.emailParameter.severIP' })}>
              {getFieldDecorator('mailHost', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your mailHost',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'systemManagement.emailParameter.port' })}>
              {getFieldDecorator('mailPort', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your mailPort',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.emailParameter.senderEmailAddress' })}
            >
              {getFieldDecorator('mailAddress', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your mailAddress',
                  },
                ],
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.emailParameter.senderEmailPassword' })}
            >
              {getFieldDecorator('mailPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your mailPassword',
                  },
                ],
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="是否开启：">
              {getFieldDecorator('isopen', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your isopen',
                  },
                ],
              })(
                <Select
                  defaultValue="0"
                  style={{ width: 300 }}
                  onChange={this.handleChange}
                  placeholder="Please select"
                  className={styles.inputValue}
                >
                  <Option value="0">开启</Option>
                  <Option value="1">关闭</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="备注：">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your remark',
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

const NewAddForm = Form.create({})(AddForm);

class ModifyForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { emailObj } = this.props;
    return (
      <Fragment>
        <div>
          <Form layout="inline" className={styles.formWrap}>
            <Form.Item label={formatMessage({ id: 'systemManagement.emailParameter.severIP' })}>
              {getFieldDecorator('mailHost', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your mailHost',
                  },
                ],
                initialValue: emailObj.mailHost,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'systemManagement.emailParameter.port' })}>
              {getFieldDecorator('mailPort', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your mailPort',
                  },
                ],
                initialValue: emailObj.mailPort,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.emailParameter.senderEmailAddress' })}
            >
              {getFieldDecorator('mailAddress', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your mailAddress',
                  },
                ],
                initialValue: emailObj.mailAddress,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.emailParameter.senderEmailPassword' })}
            >
              {getFieldDecorator('mailPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your mailPassword',
                  },
                ],
                initialValue: emailObj.mailPassword,
              })(<Input.Password className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="是否开启：">
              {getFieldDecorator('isopen', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your isopen',
                  },
                ],
                initialValue: emailObj.isopen,
              })(
                <Select
                  defaultValue="0"
                  style={{ width: 300 }}
                  onChange={this.handleChange}
                  placeholder="Please select"
                  className={styles.inputValue}
                >
                  <Option value="0">开启</Option>
                  <Option value="1">关闭</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="备注：">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your remark',
                  },
                ],
                initialValue: emailObj.remark,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const NewModifyForm = Form.create({})(ModifyForm);
@connect(({ getEmail, loading }) => ({
  loading: loading.effects,
  getEmailListData: getEmail.data,
}))
class EmailParameter extends Component {
  state = {
    addVisible: false,
    modifyVisible: false,
    deleteVisible: false,
    mailId: '',
    page: {
      pageNumber: '1',
      pageSize: '10',
    },
    columns: [
      {
        title: '配置ID',
        dataIndex: 'mailId',
        key: 'mailId',
      },
      {
        title: formatMessage({ id: 'systemManagement.emailParameter.severIP' }),
        dataIndex: 'mailHost',
        key: 'mailHost',
      },
      {
        title: formatMessage({ id: 'systemManagement.emailParameter.port' }),
        dataIndex: 'mailPort',
        key: 'mailPort',
      },
      {
        title: formatMessage({ id: 'systemManagement.emailParameter.senderEmailAddress' }),
        dataIndex: 'mailAddress',
        key: 'mailAddress',
      },
      {
        title: '是否开启',
        dataIndex: 'isopen',
        key: 'isopen',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: formatMessage({ id: 'app.common.operation' }),
        dataIndex: 'operation',
        key: 'operation',
        render: (res, recode) => (
          <span className={styles.operation}>
            <a
              href="#"
              onClick={() => {
                this.updateEmail(res, recode);
              }}
            >
              {formatMessage({ id: 'app.common.modify' })}
            </a>
            <a
              href="#"
              onClick={() => {
                this.deleteEmail(res, recode);
              }}
            >
              {formatMessage({ id: 'app.common.delete' })}
            </a>
          </span>
        ),
      },
    ],
    // header: [
    //   {
    //     field: 'personid',
    //     caption: 'ID',
    //     width: 100,
    //     headerStyle: { textAlign: 'center' },
    //     style: { textAlign: 'center' },
    //   },
    //   {
    //     field: 'fname',
    //     caption: 'First Name',
    //     width: 200,
    //     sort: true,
    //     style: { textAlign: 'center' },
    //   },
    //   {
    //     field: 'lname',
    //     caption: 'Last Name',
    //     width: 100,
    //     headerStyle: { textAlign: 'center' },
    //     style: { textAlign: 'center' },
    //   },
    //   {
    //     field: 'email',
    //     caption: 'Email',
    //     width: 'auto',
    //     headerStyle: { textAlign: 'center' },
    //     style: { textAlign: 'center' },
    //   },
    //   // {
    //   //   field: 'action',
    //   //   caption: 'Action',
    //   //   width: 60,
    //   //   headerStyle: { textAlign: 'center' },
    //   //   style: { textAlign: 'center' },
    //   //   columnType: new cheetahGrid.columns.type.ButtonColumn({
    //   //     caption: '修改',
    //   //   }),
    //   //   action: new cheetahGrid.columns.action.ButtonAction({
    //   //     action() {
    //   //       alert('click modify');
    //   //     },
    //   //   }),
    //   // },
    //   // {
    //   //   field: 'action1',
    //   //   caption: '',
    //   //   width: 60,
    //   //   headerStyle: { textAlign: 'center' },
    //   //   style: { textAlign: 'center' },
    //   //   columnType: new cheetahGrid.columns.type.ButtonColumn({
    //   //     caption: '删除',
    //   //   }),
    //   //   action: new cheetahGrid.columns.action.ButtonAction({
    //   //     action() {
    //   //       alert('click delete');
    //   //     },
    //   //   }),
    //   // },
    // ],
    records: generatePersons(1000),
  };

  addFormRef = React.createRef();

  modifyForm = React.createRef();

  componentDidMount() {
    this.getEmailInit();
    // console.log(this.props.getEmailListData);
  }

  addUser = () => {
    this.setState({ addVisible: true });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    this.addFormRef.current.validateFields((err, values) => {
      const param = {
        mailHost: values.mailHost,
        mailPort: values.mailPort,
        mailAddress: values.mailAddress,
        mailPassword: values.mailPassword,
        isopen: values.isopen,
        remark: values.remark,
        isAddConfig: true,
      };
      dispatch({
        type: 'getEmail/addEmailDate',
        payload: param,
        callback: () => {
          this.getEmailInit();
          this.setState({ addVisible: false });
        },
      });
    });
  };

  handleCancel = () => {
    this.setState({ addVisible: false });
  };

  handleChange = () => {};

  // 修改
  updateEmail = (res, obj) => {
    const Obj = {
      mailHost: obj.mailHost,
      mailPort: obj.mailPort,
      mailAddress: obj.mailAddress,
      mailPassword: obj.mailPassword,
      isopen: obj.isopen,
      remark: obj.remark,
      isAddConfig: obj.isAddConfig,
    };
    this.setState(
      {
        modifyVisible: true,
        emailObj: Obj,
      },
      () => {
        console.log('emailObj=', this.state.emailObj);
      },
    );
  };

  modifyConfirm = () => {
    const { dispatch } = this.props;
    this.modifyForm.current.validateFields((err, values) => {
      const param = {
        mailHost: values.mailHost,
        mailPort: values.mailPort,
        mailAddress: values.mailAddress,
        mailPassword: values.mailPassword,
        isopen: values.isopen,
        remark: values.remark,
      };
      dispatch({
        type: 'getEmail/addEmailDate',
        payload: param,
        callback: () => {
          this.getEmailInit();
          this.setState({
            modifyVisible: false,
          });
        },
      });
    });
  };

  modifyCancel = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  setServer = () => {};

  handleSubmit = () => {};

  // 删除
  deleteEmail = (res, obj) => {
    this.setState({
      mailId: obj.mailId,
      deleteVisible: true,
    });
  };

  deleteConfirm = () => {
    const { dispatch } = this.props;
    const param = {
      mailId: this.state.mailId,
    };
    dispatch({
      type: 'getEmail/deleteEmailDate',
      payload: param,
      callback: () => {
        this.getEmailInit();
        this.setState({
          deleteVisible: false,
        });
      },
    });
  };

  deleteCancel = () => {
    this.setState({
      deleteVisible: false,
    });
  };

  getEmailInit = () => {
    const { dispatch } = this.props;
    const params = {
      pageNumber: this.state.page.pageNumber,
      pageSize: this.state.page.pageSize,
    };
    dispatch({
      type: 'getEmail/getEmailList',
      payload: params,
    });
  };

  // 数据处理函数
  formatIsOpen = value => {
    const obj = {
      0: '关闭',
      1: '开启',
    };
    return obj[value];
  };

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = (pageNumber, pageSize) => {
    const page = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    };

    this.setState(
      {
        page,
      },
      () => {
        this.getEmailInit();
      },
    );
  };

  onShowSizeChange = (pageNumber, pageSize) => {
    console.log('pageNumber, pageSize=', pageNumber, pageSize);
  };

  render() {
    const { loading, getEmailListData } = this.props;
    const { page } = this.state;
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <div>
              <Modal
                title="新增绑定配置"
                visible={this.state.addVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelText={formatMessage({ id: 'app.common.cancel' })}
                okText={formatMessage({ id: 'app.common.save' })}
              >
                <div>
                  <NewAddForm ref={this.addFormRef}></NewAddForm>
                </div>
              </Modal>
              {/* 修改 */}
              <Modal
                title="修改邮件配置"
                visible={this.state.modifyVisible}
                onOk={this.modifyConfirm}
                onCancel={this.modifyCancel}
                cancelText={formatMessage({ id: 'app.common.cancel' })}
                okText={formatMessage({ id: 'app.common.save' })}
              >
                <NewModifyForm ref={this.modifyForm} emailObj={this.state.emailObj}></NewModifyForm>
              </Modal>
              {/* 删除 */}
              <Modal
                title="修改邮件配置"
                visible={this.state.deleteVisible}
                onOk={this.deleteConfirm}
                onCancel={this.deleteCancel}
                cancelText={formatMessage({ id: 'app.common.cancel' })}
                okText={formatMessage({ id: 'app.common.save' })}
              >
                <div>
                  <span>确定删除吗？</span>
                </div>
              </Modal>
            </div>
            <div>
              <TableHeader showEdit showSelect addTableData={() => this.addUser()}></TableHeader>
              <Table
                pagination={false}
                loading={loading['getEmail/getEmailList']}
                dataSource={getEmailListData.items}
                columns={this.state.columns}
              ></Table>
              <CustomizePagination
                total={getEmailListData.totalCount}
                pageSize={page.pageSize}
                showSizeChanger
                onChange={this.pageChange}
              ></CustomizePagination>
            </div>
          </div>
          {/* 这是KdTable渲染的表格 */}
          <KdTable dataSource={this.state.records}></KdTable>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default EmailParameter;
