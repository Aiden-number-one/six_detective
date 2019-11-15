import React, { Component, Fragment } from 'react';
import { Input, Modal, Select, Table, Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { connect } from 'dva';
import styles from './params.less';
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
            <Form.Item label="参数类型：">
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
            <Form.Item label="参数key：">
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
            <Form.Item label="参数值：">
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
            <Form.Item label="备注：">
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
          title: '序号',
          dataIndex: 'index',
          key: 'index',
        },
        {
          title: '参数类型',
          dataIndex: 'paramType',
          key: 'paramType',
        },
        {
          title: '参数key',
          dataIndex: 'paramId',
          key: 'paramId',
        },
        {
          title: '参数值',
          dataIndex: 'paramValue',
          key: 'paramValue',
        },
        {
          title: '备注',
          dataIndex: 'comments',
          key: 'comments',
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
                  this.updateSystemParams(res, recode, index, active);
                }}
              >
                修改
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
    // eslint-disable-next-line array-callback-return
    // eslint-disable-next-line no-unused-expressions
    getSystemParamsList &&
      // eslint-disable-next-line array-callback-return
      getSystemParamsList.map((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index = (this.state.pageNum - 1) * pageSize + index + 1;
      });
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <div>
              <div>
                <span>参数类型：</span>
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
