import React, { Component, Fragment } from 'react';
import { Input, Modal, Select, Table, Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './SystemParameters.less';
import TableHeader from '@/components/TableHeader';

const { Option } = Select;

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
  constructor() {
    super();
    this.modifyFormRef = React.createRef();
    this.state = {
      updateSystemParamsVisible: false,
      pageNum: '1',
      pageSize: '10',
      columns: [
        {
          title: formatMessage({ id: 'app.common.number' }),
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterType' }),
          dataIndex: 'paramType',
          key: 'paramType',
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterKey' }),
          dataIndex: 'paramId',
          key: 'paramId',
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterValue' }),
          dataIndex: 'paramValue',
          key: 'paramValue',
        },
        {
          title: formatMessage({ id: 'app.common.note' }),
          dataIndex: 'comments',
          key: 'comments',
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
      ParamsTypeData: {},
      paramObj: {},
    };
  }

  componentDidMount() {
    this.querySystemParams();
    this.getParamsTypeList();
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

  querySystemParams = (paramType = '') => {
    const { dispatch } = this.props;
    const param = {
      paramType,
      pageNumber: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    dispatch({
      type: 'systemParams/getSystemParamsList',
      payload: param,
    });
  };

  getParamsTypeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemParams/getParamsType',
      payload: {},
    });
  };

  onChangeOption = value => {
    this.querySystemParams(value);
  };

  pageChange = pagination => {
    this.setState(
      {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
      () => {
        this.querySystemParams();
      },
    );
  };

  render() {
    const { loading, getParamsTypeData, getSystemParamsListData } = this.props;
    let { ParamsTypeData, getSystemParamsList } = this.state;
    const { pageSize } = this.state;
    ParamsTypeData = getParamsTypeData;
    getSystemParamsList = getSystemParamsListData.items;
    const totalCount = getSystemParamsListData && getSystemParamsListData.totalCount;
    // eslint-disable-next-line no-unused-expressions
    getSystemParamsList &&
      getSystemParamsList.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index = (this.state.pageNum - 1) * pageSize + index + 1;
      });
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <div>
              <div>
                <span>
                  {formatMessage({ id: 'systemManagement.systemParameters.parameterType' })}：
                </span>
                <Select
                  defaultValue="请选择"
                  onChange={this.onChangeOption}
                  style={{ width: '220px' }}
                >
                  <Option value="">请选择</Option>
                  {ParamsTypeData[0] &&
                    ParamsTypeData[0].data.map(element => (
                      <Option value={element}>{element}</Option>
                    ))}
                </Select>
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
              <TableHeader showEdit={false} showSelect={false}></TableHeader>
              <Table
                loading={loading['systemParams/getSystemParamsList']}
                dataSource={getSystemParamsList}
                columns={this.state.columns}
                pagination={{ total: totalCount, pageSize }}
                onChange={this.pageChange}
              ></Table>
            </div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default SystemParams;
