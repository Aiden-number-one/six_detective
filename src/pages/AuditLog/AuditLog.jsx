import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Table, Pagination } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './AuditLog.less';
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
    functionNameOptions: [
      { key: '', value: '', title: 'All' },
      { key: '1', value: '1', title: 'Name One' },
      { key: '2', value: '2', title: 'Name Two' },
      { key: '3', value: '3', title: 'Name Three' },
    ],
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
        title: formatMessage({ id: 'systemManagement.auditLog.functionName' }),
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.tableName' }),
        dataIndex: 'formName',
        key: 'formName',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.BITOCode' }),
        dataIndex: 'biToCode',
        key: 'biToCode',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.productCode' }),
        dataIndex: 'productCode',
        key: 'productCode',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.effectiveDate' }),
        dataIndex: 'operateDate',
        key: 'operateDate',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.fieldUpdated' }),
        dataIndex: 'ipAddress',
        key: 'ipAddress',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.updateType' }),
        dataIndex: 'ipAddress',
        key: 'ipAddress',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.logDate' }),
        dataIndex: 'operateTime',
        key: 'operateTime',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.updatedBy' }),
        dataIndex: 'operateTime',
        key: 'operateTime',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.before' }),
        dataIndex: 'operateTime',
        key: 'operateTime',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.after' }),
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
      if (logDate && logDate.length > 0) {
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
    const { page, functionNameOptions } = this.state;
    getAuditLogList = this.props.getAuditLogListData.items;
    const totalCount = this.props.getAuditLogListData && this.props.getAuditLogListData.totalCount;
    return (
      <PageHeaderWrapper>
        <NewSearchForm
          search={this.queryLog}
          ref={this.auditLogForm}
          functionNameOptions={functionNameOptions}
        />
        <div className={styles.content}>
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
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default AuditLog;
