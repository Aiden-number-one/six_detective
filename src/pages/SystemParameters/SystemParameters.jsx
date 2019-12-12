import React, { Component, Fragment } from 'react';
import { Input, Modal, Select, Table, Form, Pagination } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './SystemParameters.less';

import SearchForm from './components/SearchForm';

const { Option } = Select;

const NewSearchForm = Form.create({})(SearchForm);

class ModifyForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { paramObj } = this.props;
    return (
      <Fragment>
        <div>
          <Form layout="inline" className={styles.formWrap}>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.systemParameters.parameterType' })}
            >
              {getFieldDecorator('paramType', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your paramType',
                  },
                ],
                initialValue: paramObj.paramType,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.systemParameters.parameterKey' })}
            >
              {getFieldDecorator('paramId', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your paramId',
                  },
                ],
                initialValue: paramObj.paramId,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.systemParameters.parameterValue' })}
            >
              {getFieldDecorator('paramValue', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid paramValue!',
                  },
                  {
                    required: true,
                    message: 'Please input your paramValue',
                  },
                ],
                initialValue: paramObj.paramValue,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
            <Form.Item label="是否开启：">
              {getFieldDecorator('paramStatus', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your paramStatus',
                  },
                ],
                initialValue: paramObj.paramStatus,
              })(
                <Select
                  defaultValue="0"
                  style={{ width: 300 }}
                  onChange={this.handleChange}
                  placeholder="Please select"
                  className={styles.inputValue}
                >
                  <Option value="0">停用</Option>
                  <Option value="1">启用</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'app.common.note' })}>
              {getFieldDecorator('comments', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your comments',
                  },
                ],
                initialValue: paramObj.comments,
              })(<Input className={styles.inputValue} />)}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const NewModifyForm = Form.create({})(ModifyForm);
@connect(({ systemParams, loading }) => ({
  loading: loading.effects,
  getSystemParamsListData: systemParams.data,
  getParamsTypeData: systemParams.getParamsData,
}))
class SystemParams extends Component {
  searchForm = React.createRef();

  constructor() {
    super();
    this.modifyFormRef = React.createRef();
    this.state = {
      updateSystemParamsVisible: false,
      page: {
        pageNumber: 1,
        pageSize: 10,
      },
      columns: [
        {
          title: formatMessage({ id: 'app.common.number' }),
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterType' }),
          dataIndex: 'parameterType',
          key: 'parameterType',
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterKey' }),
          dataIndex: 'parameterKey',
          key: 'parameterKey',
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterValue' }),
          dataIndex: 'parameterValue',
          key: 'parameterValue',
        },
        {
          title: formatMessage({ id: 'app.common.note' }),
          dataIndex: 'note',
          key: 'note',
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
                  this.updateSystemParams(res, recode, index, active);
                }}
              >
                {formatMessage({ id: 'app.common.modify' })}
              </a>
            </span>
          ),
        },
      ],
      getSystemParamsList: [],
      paramObj: {},
    };
  }

  componentDidMount() {
    this.querySystemParams();
  }

  updateSystemParamsComfirm = () => {
    this.modifyFormRef.current.validateFields((err, values) => {
      const { dispatch } = this.props;
      const param = {
        comments: values.comments,
        paramId: values.paramId,
        paramStatus: values.paramStatus,
        paramType: values.paramType,
        paramValue: values.paramValue,
      };
      dispatch({
        type: 'systemParams/systemParamsUpdate',
        payload: param,
        callback: () => {
          this.querySystemParams();
        },
      });
    });
    this.setState({ updateSystemParamsVisible: false });
  };

  updateSystemParamsCancel = () => {
    this.setState({ updateSystemParamsVisible: false });
  };

  handleChange = () => {};

  updateSystemParams = (res, obj) => {
    const paramObj = {
      comments: obj.comments,
      paramId: obj.paramId,
      paramStatus: obj.paramStatus,
      paramType: obj.paramType,
      paramValue: obj.paramValue,
    };
    this.setState({ updateSystemParamsVisible: true, paramObj });
  };

  querySystemParams = () => {
    const { dispatch } = this.props;
    const { page, paramType } = this.state;

    const param = {
      paramType,
      pageNumber: page.pageNumber,
      pageSize: page.pageSize,
    };
    dispatch({
      type: 'systemParams/getSystemParamsList',
      payload: param,
    });
  };

  onChangeOption = value => {
    this.querySystemParams(value);
  };

  /**
   * @description: This is for paging function.
   * @param {type} null
   * @return: undefined
   */
  pageChange = (pageNumber, pageSize) => {
    const page = {
      pageNumber,
      pageSize,
    };

    this.setState(
      {
        page,
      },
      () => {
        this.querySystemParams();
      },
    );
  };

  onShowSizeChange = (current, pageSize) => {
    const page = {
      pageNumber: current,
      pageSize,
    };
    this.setState(
      {
        page,
      },
      () => {
        this.querySystemParams();
      },
    );
  };

  queryLog = () => {};

  render() {
    const { loading, getSystemParamsListData } = this.props;
    let { getSystemParamsList } = this.state;
    const { page } = this.state;
    getSystemParamsList = getSystemParamsListData.items;
    // const totalCount = getSystemParamsListData && getSystemParamsListData.totalCount;
    // eslint-disable-next-line no-unused-expressions
    getSystemParamsList &&
      getSystemParamsList.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index = (page.pageNumber - 1) * page.pageSize + index + 1;
      });
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <div>
              <div>
                <NewSearchForm search={this.queryLog} ref={this.searchForm}></NewSearchForm>
              </div>
              <Modal
                title="修改系统参数"
                visible={this.state.updateSystemParamsVisible}
                onOk={this.updateSystemParamsComfirm}
                onCancel={this.updateSystemParamsCancel}
                cancelText={formatMessage({ id: 'app.common.cancel' })}
                okText={formatMessage({ id: 'app.common.save' })}
              >
                <NewModifyForm
                  ref={this.modifyFormRef}
                  paramObj={this.state.paramObj}
                ></NewModifyForm>
              </Modal>
            </div>
            <div>
              <Table
                loading={loading['systemParams/getSystemParamsList']}
                dataSource={getSystemParamsList}
                columns={this.state.columns}
                pagination={false}
              ></Table>
              <Pagination
                showSizeChanger
                current={page.pageNumber}
                showTotal={() =>
                  `Page ${page.pageNumber.toString()} of ${Math.ceil(
                    getSystemParamsListData.totalCount / page.pageSize,
                  ).toString()}`
                }
                onShowSizeChange={this.onShowSizeChange}
                onChange={this.pageChange}
                total={getSystemParamsListData.totalCount}
                pageSize={page.pageSize}
              />
            </div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default SystemParams;
