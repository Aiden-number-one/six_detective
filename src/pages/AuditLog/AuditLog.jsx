import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Table, Pagination, Modal, Radio } from 'antd';
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
    exportDataVisible: false,
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
        minWidth: 60,
        render: (res, recode, index) => (
          <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
        ),
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.functionName' }),
        dataIndex: 'functionName',
        key: 'functionName',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.tableName' }),
        dataIndex: 'tableName',
        key: 'tableName',
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
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        render: (res, obj) => (
          <div>
            <span>{obj.operateDate && moment(obj.operateDate).format('DD/MM/YYYY')}</span>
          </div>
        ),
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.fieldUpdated' }),
        dataIndex: 'filedUpdated',
        key: 'filedUpdated',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.updateType' }),
        dataIndex: 'updateType',
        key: 'updateType',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.logDate' }),
        dataIndex: 'logTime',
        key: 'logTime',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.updatedBy' }),
        dataIndex: 'updatedBy',
        key: 'updatedBy',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.before' }),
        dataIndex: 'before',
        key: 'before',
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.after' }),
        dataIndex: 'after',
        key: 'after',
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
      functionName,
      startTime: logStartDate,
      endTime: logEndDate,
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
      console.log('values===', values);
      const { logDate } = values;
      let logStartDate;
      let logEndDate;
      if (logDate && logDate.length > 0) {
        logStartDate = `${moment(logDate[0]).format('YYYY-MM-DD')} 00:00:00`;
        logEndDate = `${moment(logDate[1]).format('YYYY-MM-DD')} 23:59:59`;
      }
      this.setState(
        {
          logStartDate,
          logEndDate,
          functionName: values.functionName,
          updatedBy: values.updatedBy,
        },
        () => {
          this.getAuditLog();
        },
      );
    });
  };

  exportData = () => {
    this.setState({
      exportDataVisible: true,
    });
  };

  exportDataConfirm = () => {
    const { dispatch } = this.props;
    const param = {
      fileType: '1',
      apiVersion: 'v2.0',
      apiName: 'bayconnect.superlop.get_system_log_list',
    };
    dispatch(
      {
        type: 'auditLog/getDataExport',
        payload: param,
      },
      () => {
        this.setState({
          exportDataVisible: false,
        });
      },
    );
  };

  exportDataCancel = () => {
    this.setState({
      exportDataVisible: false,
    });
  };

  operatorReset = () => {
    this.auditLogForm.current.resetFields();
  };

  render() {
    const { loading } = this.props;
    let { getAuditLogList } = this.state;
    const { page, functionNameOptions, exportDataVisible } = this.state;
    getAuditLogList = this.props.getAuditLogListData.items;
    const totalCount = this.props.getAuditLogListData && this.props.getAuditLogListData.totalCount;
    return (
      <PageHeaderWrapper>
        <NewSearchForm
          search={this.queryLog}
          exportData={this.exportData}
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
          {getAuditLogList && getAuditLogList.length > 0 && (
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
          )}
        </div>
        <Modal
          title="Select export format"
          visible={exportDataVisible}
          onOk={this.exportDataConfirm}
          onCancel={this.exportDataCancel}
          cancelText={formatMessage({ id: 'app.common.cancel' })}
          okText={formatMessage({ id: 'app.common.save' })}
        >
          <div>
            <Radio.Group name="radiogroup" defaultValue={2}>
              <Radio value={1}>csv</Radio>
              <Radio value={2}>xlsx</Radio>
              <Radio value={3}>docx</Radio>
              <Radio value={4}>pdf</Radio>
            </Radio.Group>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default AuditLog;
