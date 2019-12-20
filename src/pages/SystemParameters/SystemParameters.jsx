import React, { Component, Fragment } from 'react';
import { Table, Form, Pagination, Drawer } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import styles from './SystemParameters.less';

import SearchForm from './components/SearchForm';
import ModifySystem from './components/ModifySystem';

// const { Option } = Select;

const NewSearchForm = Form.create({})(SearchForm);

// class ModifyForm extends Component {
//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const { paramObj } = this.props;
//     return (
//       <Fragment>
//         <div>
//           <Form layout="inline" className={styles.formWrap}>
//             <Form.Item
//               label={formatMessage({ id: 'systemManagement.systemParameters.parameterType' })}
//             >
//               {getFieldDecorator('paramType', {
//                 rules: [
//                   {
//                     required: true,
//                     message: 'Please input your paramType',
//                   },
//                 ],
//                 initialValue: paramObj.paramType,
//               })(<Input className={styles.inputValue} />)}
//             </Form.Item>
//             <Form.Item
//               label={formatMessage({ id: 'systemManagement.systemParameters.parameterKey' })}
//             >
//               {getFieldDecorator('paramId', {
//                 rules: [
//                   {
//                     required: true,
//                     message: 'Please input your paramId',
//                   },
//                 ],
//                 initialValue: paramObj.paramId,
//               })(<Input className={styles.inputValue} />)}
//             </Form.Item>
//             <Form.Item
//               label={formatMessage({ id: 'systemManagement.systemParameters.parameterValue' })}
//             >
//               {getFieldDecorator('paramValue', {
//                 rules: [
//                   {
//                     type: 'email',
//                     message: 'The input is not valid paramValue!',
//                   },
//                   {
//                     required: true,
//                     message: 'Please input your paramValue',
//                   },
//                 ],
//                 initialValue: paramObj.paramValue,
//               })(<Input className={styles.inputValue} />)}
//             </Form.Item>
//             <Form.Item label="是否开启：">
//               {getFieldDecorator('paramStatus', {
//                 rules: [
//                   {
//                     required: true,
//                     message: 'Please input your paramStatus',
//                   },
//                 ],
//                 initialValue: paramObj.paramStatus,
//               })(
//                 <Select
//                   defaultValue="0"
//                   style={{ width: 300 }}
//                   onChange={this.handleChange}
//                   placeholder="Please select"
//                   className={styles.inputValue}
//                 >
//                   <Option value="0">停用</Option>
//                   <Option value="1">启用</Option>
//                 </Select>,
//               )}
//             </Form.Item>
//             <Form.Item label={formatMessage({ id: 'app.common.note' })}>
//               {getFieldDecorator('comments', {
//                 rules: [
//                   {
//                     required: true,
//                     message: 'Please input your comments',
//                   },
//                 ],
//                 initialValue: paramObj.comments,
//               })(<Input className={styles.inputValue} />)}
//             </Form.Item>
//           </Form>
//         </div>
//       </Fragment>
//     );
//   }
// }

// const NewModifyForm = Form.create({})(ModifyForm);
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
      searchParameterType: undefined,
      page: {
        pageNumber: 1,
        pageSize: 10,
      },
      columns: [
        {
          title: formatMessage({ id: 'app.common.number' }),
          dataIndex: 'index',
          key: 'index',
          render: (res, recode, index) => (
            <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
          ),
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
          align: 'center',
          render: (res, recode, index, active) => (
            <span className={styles.operation}>
              <a
                href="#"
                onClick={() => {
                  this.updateSystemParams(res, recode, index, active);
                }}
              >
                <IconFont type="icon-edit" className={styles['btn-icon']} />
              </a>
            </span>
          ),
        },
      ],
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
      note: obj.note,
      paramId: obj.paramId,
      parameterKey: obj.parameterKey,
      parameterType: obj.parameterType,
      parameterValue: obj.parameterValue,
    };
    this.setState({ updateSystemParamsVisible: true, paramObj });
  };

  querySystemParams = () => {
    const { dispatch } = this.props;
    const { page, searchParameterType } = this.state;

    const param = {
      groupNo: searchParameterType,
      pageNumber: page.pageNumber.toString() || '1',
      pageSize: page.pageSize.toString() || '10',
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

  onClose = () => {
    this.setState({
      updateSystemParamsVisible: false,
    });
  };

  onSave = () => {
    this.setState(
      {
        updateSystemParamsVisible: false,
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

  queryLog = () => {
    this.searchForm.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState(
        {
          searchParameterType: values.parameterType,
        },
        () => {
          this.querySystemParams();
        },
      );
    });
  };

  render() {
    const { loading, getSystemParamsListData } = this.props;
    const { paramObj } = this.state;
    const { page } = this.state;
    return (
      <PageHeaderWrapper>
        <Fragment>
          <div>
            <div>
              <div>
                <NewSearchForm search={this.queryLog} ref={this.searchForm}></NewSearchForm>
              </div>
              <Drawer
                // drawerStyle={
                //   {
                //     height: '200px',
                //   }
                // }
                closable={false}
                title="Modify System Parameter"
                width={700}
                onClose={this.onClose}
                visible={this.state.updateSystemParamsVisible}
              >
                {this.state.updateSystemParamsVisible && (
                  <ModifySystem
                    onCancel={this.onClose}
                    onSave={this.onSave}
                    paramObj={paramObj}
                  ></ModifySystem>
                )}
              </Drawer>
            </div>
            <div className={styles.content}>
              <Table
                loading={loading['systemParams/getSystemParamsList']}
                dataSource={getSystemParamsListData.items}
                columns={this.state.columns}
                pagination={false}
              ></Table>
              <Pagination
                size="small"
                showSizeChanger
                current={page.pageNumber}
                showTotal={() =>
                  `Page ${(getSystemParamsListData.totalCount || 0) &&
                    page.pageNumber.toString()} of ${Math.ceil(
                    (getSystemParamsListData.totalCount || 0) / page.pageSize,
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
