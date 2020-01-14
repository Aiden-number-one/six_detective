/*
 * @Description: This is System Parameter for System Parameter setting.
 * @Author: dailinbo
 * @Date: 2019-12-24 15:19:25
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-14 22:05:45
 */
import React, { Component, Fragment } from 'react';
import { Table, Form, Pagination, Drawer } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import IconFont from '@/components/IconFont';
import styles from './SystemParameter.less';

import SearchForm from './components/SearchForm';
import ModifySystem from './components/ModifySystem';

const NewSearchForm = Form.create({})(SearchForm);

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
          align: 'center',
          width: '5%',
          render: (res, recode, index) => (
            <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
          ),
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterType' }),
          dataIndex: 'parameterType',
          key: 'parameterType',
          align: 'left',
          ellipsis: true,
          width: '20%',
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterKey' }),
          dataIndex: 'parameterKey',
          key: 'parameterKey',
          align: 'left',
          ellipsis: true,
          width: '20%',
        },
        {
          title: formatMessage({ id: 'systemManagement.systemParameters.parameterValue' }),
          dataIndex: 'parameterValue',
          key: 'parameterValue',
          align: 'left',
          ellipsis: true,
          width: '20%',
        },
        {
          title: formatMessage({ id: 'app.common.remark' }),
          dataIndex: 'note',
          key: 'note',
          align: 'left',
          ellipsis: true,
          width: '20%',
        },
        {
          title: formatMessage({ id: 'app.common.operation' }),
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          width: '15%',
          render: (res, recode, index, active) => (
            <span className={styles.operation}>
              <a
                href="#"
                onClick={() => {
                  this.updateSystemParams(res, recode, index, active);
                }}
              >
                <IconFont type="icon-edit" className="operation-icon" />
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

  /**
   * @description: This is function for get System Parameter list.
   * @param {type} null
   * @return: undefiend
   */
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
    const page = {
      pageNumber: 1,
      pageSize: 10,
    };
    this.searchForm.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState(
        {
          searchParameterType: values.parameterType,
          page,
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
            <div className="conten-wraper">
              <Table
                loading={loading['systemParams/getSystemParamsList']}
                rowKey={row => row.paramId.toString()}
                dataSource={getSystemParamsListData.items}
                columns={this.state.columns}
                pagination={false}
              ></Table>
              {getSystemParamsListData.items && getSystemParamsListData.items.length > 0 && (
                <Pagination
                  showSizeChanger
                  current={page.pageNumber}
                  showTotal={() => `Total ${getSystemParamsListData.totalCount} items`}
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.pageChange}
                  total={getSystemParamsListData.totalCount}
                  pageSize={page.pageSize}
                />
              )}
            </div>
          </div>
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}

export default SystemParams;
