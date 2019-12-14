import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Table, Pagination } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import SearchForm from './components/SearchForm';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ auditLog, loading }) => ({
  loading: loading.effects,
  getAuditLogListData: auditLog.data,
}))
class AuditLog extends Component {
  state = {
    page: {
      pageNumber: 1,
      pageSize: 10,
    },
    logStartDate: undefined,
    logEndDate: undefined,
    functionName: undefined,
    updatedBy: undefined,
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
        title: 'Function Name',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: 'Table Name',
        dataIndex: 'formName',
        key: 'formName',
      },
      {
        title: 'Code',
        dataIndex: 'biToCode',
        key: 'biToCode',
      },
      {
        title: 'Product Code',
        dataIndex: 'productCode',
        key: 'productCode',
      },
      {
        title: 'Effective Date',
        dataIndex: 'operateDate',
        key: 'operateDate',
      },
      {
        title: 'Field Updated',
        dataIndex: 'ipAddress',
        key: 'ipAddress',
      },
      {
        title: 'Update Type',
        dataIndex: 'ipAddress',
        key: 'ipAddress',
      },
      {
        title: 'Log Time',
        dataIndex: 'operateTime',
        key: 'operateTime',
      },
    ],
    getAuditLogList: [],
  };

  auditLogForm = React.createRef();

  componentDidMount() {
    this.getAuditLog();
  }

  getAuditLog = () => {
    const { logStartDate, logEndDate, functionName, updatedBy, page } = this.state;
    const param = {
      pageNumber: page.pageNumber.toString(),
      pageSize: page.pageSize.toString(),
      operatorName: functionName,
      beginDate: logStartDate,
      endDate: logEndDate,
      updatedBy,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'auditLog/getAuditLogList',
      payload: param,
    });
  };

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
        this.getAuditLog();
      },
    );
  };

  changeBeginDate = () => {};

  changeEndDate = () => {};

  queryLog = () => {
    this.auditLogForm.current.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { logDate } = values;
      let logStartDate;
      let logEndDate;
      if (logDate.length > 0) {
        logStartDate = moment(logDate[0]).format('YYYY-MM-DD');
        logEndDate = moment(logDate[1]).format('YYYY-MM-DD');
      }
      this.setState({
        logStartDate,
        logEndDate,
        functionName: values.functionName,
        updatedBy: values.updatedBy,
      });
      this.getAuditLog();
    });
  };

  operatorReset = () => {
    this.auditLogForm.current.resetFields();
  };

  render() {
    const { loading } = this.props;
    let { getAuditLogList } = this.state;
    const { page } = this.state;
    getAuditLogList = this.props.getAuditLogListData.items;
    const totalCount = this.props.getAuditLogListData && this.props.getAuditLogListData.totalCount;
    return (
      <PageHeaderWrapper>
        <NewSearchForm search={this.queryLog} ref={this.auditLogForm} />
        <Table
          loading={loading['auditLog/getAuditLogList']}
          dataSource={getAuditLogList}
          pagination={false}
          columns={this.state.columns}
        />
        <Pagination
          showSizeChanger
          current={page.pageNumber}
          showTotal={() =>
            `Page ${(totalCount || 0) && page.pageNumber.toString()} of ${Math.ceil(
              (totalCount || 0) / page.pageSize,
            ).toString()}`
          }
          onShowSizeChange={this.onShowSizeChange}
          onChange={this.pageChange}
          total={totalCount}
          pageSize={page.pageSize}
        />
      </PageHeaderWrapper>
    );
  }
}

export default AuditLog;
