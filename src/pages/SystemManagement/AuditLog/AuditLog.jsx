/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Table, Pagination, Modal, Checkbox, Row, Col } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './AuditLog.less';
import { timeFormat } from '@/utils/filter';
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
    customizeVisible: false,
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
    options: [
      { label: 'functionName', value: 'functionName' },
      { label: 'tableName', value: 'tableName' },
      { label: 'biToCode', value: 'biToCode' },
      { label: 'productCode', value: 'productCode' },
      { label: 'effectiveTime', value: 'effectiveTime' },
      { label: 'filedUpdated', value: 'filedUpdated' },
      { label: 'updateType', value: 'updateType' },
      { label: 'logTime', value: 'logTime' },
      { label: 'updatedBy', value: 'updatedBy' },
      { label: 'before', value: 'before' },
      { label: 'after', value: 'after' },
    ],
    checkedValues: [],
    tempColumns: [],
    cuscomizeColumns: [
      {
        key: 'index',
        visible: true,
      },
      {
        key: 'functionName',
        visible: true,
      },
      {
        key: 'tableName',
        visible: true,
      },
      {
        key: 'biToCode',
        visible: false,
      },
      {
        key: 'productCode',
        visible: true,
      },
      {
        key: 'effectiveTime',
        visible: true,
        className: 'columnsnone',
      },
      {
        key: 'filedUpdated',
        visible: false,
      },
      {
        key: 'updateType',
        visible: false,
      },
      {
        key: 'logTime',
        visible: true,
      },
      {
        key: 'updatedBy',
        visible: true,
      },
      {
        key: 'before',
        visible: false,
      },
      {
        key: 'after',
        visible: false,
      },
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
        ellipsis: true,
        width: 120,
      },
      {
        title: formatMessage({ id: 'systemManagement.auditLog.tableName' }),
        dataIndex: 'tableName',
        key: 'tableName',
        ellipsis: true,
        width: 120,
        colSpan: 1,
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
        align: 'center',
        render: (res, obj) => (
          <div>
            <span>{obj.logTime && timeFormat(obj.logTime).t1}</span>
            <br />
            <span>{obj.logTime && timeFormat(obj.logTime).t2}</span>
          </div>
        ),
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
    this.filterColumns();
    this.getAuditLog();
  }

  filterColumns = () => {
    const { columns, cuscomizeColumns } = this.state;
    const newColumns = columns.map(item => {
      const newItem = Object.assign({}, item);
      cuscomizeColumns.filter(element => {
        if (element.key === item.key) {
          newItem.visible = element.visible;
        }
      });
      return newItem;
    });
    const arrVisible = [];
    const checkedValues = [];
    const tempColumns = [];
    newColumns.forEach((element, index) => {
      if (!element.visible) {
        arrVisible.push(index);
      } else {
        checkedValues.push(element.key);
      }
    });
    arrVisible.forEach((element, index) => {
      newColumns.splice(element - index, 1);
      tempColumns.push(newColumns[element - index]);
    });
    this.setState({
      columns: newColumns,
      checkedValues,
      tempColumns,
    });
  };

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
      callback: () => {
        // const newColumns = columns.map(item => {
        //   const newItem = Object.assign({}, item);
        //   const filterColumns = cuscomizeColumns.filter(element => element.key === item.key);
        //   newItem.colSpan = filterColumns.colSpan;
        //   return newItem;
        // });
        // this.setState({
        //   columns: newColumns,
        // });
      },
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
      isPage: 'true',
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

  customizeDisplay = () => {
    this.filterColumns();
    this.setState({
      customizeVisible: true,
    });
  };

  customizeConfirm = () => {
    const { checkedValues, tempColumns, columns } = this.state;
    this.setState({
      customizeVisible: false,
      // checkedValues: tempCheckedValues,
    });
    console.log('checkedValues, tempColumns, columns===', checkedValues, tempColumns, columns);
  };

  customizeCancel = () => {
    this.setState({
      customizeVisible: false,
    });
  };

  onChangeCheckbox = checkedValues => {
    console.log('checkedValues===', checkedValues);
    this.setState({
      checkedValues,
    });
  };

  operatorReset = () => {
    this.auditLogForm.current.resetFields();
  };

  render() {
    const { loading } = this.props;
    let { getAuditLogList } = this.state;
    const { page, functionNameOptions, exportDataVisible, options, checkedValues } = this.state;
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
          <Row type="flex" justify="end">
            <Col>
              <span className={styles.customizeDisplay} onClick={this.customizeDisplay}>
                Customize Display
              </span>
            </Col>
          </Row>
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
          title={formatMessage({ id: 'app.common.confirm' })}
          visible={this.state.customizeVisible}
          onOk={this.customizeConfirm}
          onCancel={this.customizeCancel}
          cancelText={formatMessage({ id: 'app.common.cancel' })}
          okText={formatMessage({ id: 'app.common.confirm' })}
        >
          <div>
            <Checkbox.Group
              options={options}
              value={checkedValues}
              onChange={this.onChangeCheckbox}
            />
          </div>
        </Modal>
        <Modal
          title="Select Export Format"
          visible={exportDataVisible}
          onOk={this.exportDataConfirm}
          onCancel={this.exportDataCancel}
          cancelText={formatMessage({ id: 'app.common.cancel' })}
          okText={formatMessage({ id: 'app.common.save' })}
        >
          <div>
            <Checkbox.Group>
              <Checkbox value={1}>csv</Checkbox>
              <Checkbox value={2}>xlsx</Checkbox>
              <Checkbox value={3}>docx</Checkbox>
              <Checkbox value={4}>pdf</Checkbox>
            </Checkbox.Group>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default AuditLog;
