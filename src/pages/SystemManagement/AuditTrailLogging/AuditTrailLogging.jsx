/*
 * @Description: This is Audit Trail Logging for log.
 * @Author: dailinbo
 * @Date: 2019-12-30 12:12:26
 * @LastEditors  : dailinbo
 * @LastEditTime : 2020-01-10 14:46:12
 */
/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Table, Pagination, Modal, Checkbox, Row, Col, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './AuditTrailLogging.less';
import { timeFormat } from '@/utils/filter';
import SearchForm from './components/SearchForm';
import IconFont from '@/components/IconFont';
import { downloadFile } from '@/pages/DataImportLog/constants';

const NewSearchForm = Form.create({})(SearchForm);

@connect(({ auditLog, loading }) => ({
  loading: loading.effects,
  getAuditLogListData: auditLog.data,
  dataExport: auditLog.dataExportPath,
}))
class AuditTrailLogging extends Component {
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
    exportTypes: [],
    functionNameOptions: [
      { key: '', value: '', title: 'All' },
      { key: '1', value: '1', title: 'Name One' },
      { key: '2', value: '2', title: 'Name Two' },
      { key: '3', value: '3', title: 'Name Three' },
    ],
    options: [
      {
        label: formatMessage({ id: 'systemManagement.auditLog.functionName' }),
        value: 'functionName',
      },
      { label: formatMessage({ id: 'systemManagement.auditLog.tableName' }), value: 'tableName' },
      { label: formatMessage({ id: 'systemManagement.auditLog.BITOCode' }), value: 'biToCode' },
      {
        label: formatMessage({ id: 'systemManagement.auditLog.productCode' }),
        value: 'productCode',
      },
      {
        label: formatMessage({ id: 'systemManagement.auditLog.effectiveDate' }),
        value: 'effectiveTime',
      },
      {
        label: formatMessage({ id: 'systemManagement.auditLog.fieldUpdated' }),
        value: 'filedUpdated',
      },
      { label: formatMessage({ id: 'systemManagement.auditLog.updateType' }), value: 'updateType' },
      { label: formatMessage({ id: 'systemManagement.auditLog.logDate' }), value: 'logTime' },
      { label: formatMessage({ id: 'systemManagement.auditLog.updatedBy' }), value: 'updatedBy' },
      { label: formatMessage({ id: 'systemManagement.auditLog.before' }), value: 'before' },
      { label: formatMessage({ id: 'systemManagement.auditLog.after' }), value: 'after' },
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
        index: 0,
        title: formatMessage({ id: 'app.common.number' }),
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        render: (res, recode, index) => (
          <span>{(this.state.page.pageNumber - 1) * this.state.page.pageSize + index + 1}</span>
        ),
      },
      {
        index: 1,
        title: formatMessage({ id: 'systemManagement.auditLog.functionName' }),
        dataIndex: 'functionName',
        key: 'functionName',
        ellipsis: true,
        align: 'left',
      },
      {
        index: 2,
        title: formatMessage({ id: 'systemManagement.auditLog.tableName' }),
        dataIndex: 'tableName',
        key: 'tableName',
        ellipsis: true,
        align: 'left',
        colSpan: 1,
      },
      {
        index: 3,
        title: formatMessage({ id: 'systemManagement.auditLog.BITOCode' }),
        dataIndex: 'biToCode',
        key: 'biToCode',
        align: 'left',
      },
      {
        index: 4,
        title: formatMessage({ id: 'systemManagement.auditLog.productCode' }),
        dataIndex: 'productCode',
        key: 'productCode',
        align: 'left',
      },
      {
        index: 5,
        title: formatMessage({ id: 'systemManagement.auditLog.effectiveDate' }),
        dataIndex: 'effectiveTime',
        key: 'effectiveTime',
        align: 'center',
        width: 180,
        date: true,
        render: (res, obj) => <span>{obj.effectiveTime && timeFormat(obj.effectiveTime)}</span>,
      },
      {
        index: 6,
        title: formatMessage({ id: 'systemManagement.auditLog.fieldUpdated' }),
        dataIndex: 'filedUpdated',
        key: 'filedUpdated',
        align: 'left',
      },
      {
        index: 7,
        title: formatMessage({ id: 'systemManagement.auditLog.updateType' }),
        dataIndex: 'updateType',
        key: 'updateType',
        align: 'left',
      },
      {
        index: 8,
        title: formatMessage({ id: 'systemManagement.auditLog.logDate' }),
        dataIndex: 'logTime',
        key: 'logTime',
        align: 'center',
        date: true,
        render: (res, obj) => <span>{obj.logTime && timeFormat(obj.logTime)}</span>,
      },
      {
        index: 9,
        title: formatMessage({ id: 'systemManagement.auditLog.updatedBy' }),
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        align: 'left',
      },
      {
        index: 10,
        title: formatMessage({ id: 'systemManagement.auditLog.before' }),
        dataIndex: 'before',
        key: 'before',
        align: 'left',
      },
      {
        index: 11,
        title: formatMessage({ id: 'systemManagement.auditLog.after' }),
        dataIndex: 'after',
        key: 'after',
        align: 'left',
      },
    ],
    getAuditLogList: [],
  };

  auditLogForm = React.createRef();

  componentDidMount() {
    this.filterColumns();
    this.getAuditLog();
  }

  /**
   * @description: This is function for init Columns.
   * @param {type} null
   * @return: undefined
   */
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
    newColumns.forEach((element, index) => {
      if (!element.visible) {
        arrVisible.push(index);
      } else {
        checkedValues.push(element.key);
      }
    });
    arrVisible.forEach((element, index) => {
      newColumns.splice(element - index, 1);
    });
    newColumns.forEach((element, index) => {
      if (index === 0) {
        element.width = 60;
      }
      if (index === newColumns.length - 1) {
        element.width = 120;
      }
    });
    this.setState({
      tempColumns: columns,
      columns: newColumns,
      checkedValues,
    });
  };

  /**
   * @description: This is function for get log list.
   * @param {type} null
   * @return: undefined
   */
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
      callback: () => {},
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
    const { exportTypes } = this.state;
    // eslint-disable-next-line no-restricted-syntax
    for (const exportType of exportTypes) {
      this.goExport(exportType);
    }
  };

  goExport = exportType => {
    const { dispatch } = this.props;
    const param = {
      fileType: exportType,
      apiVersion: 'v2.0',
      isPage: 'true',
      apiName: 'bayconnect.superlop.get_system_log_list',
    };
    dispatch({
      type: 'auditLog/getDataExport',
      payload: param,
      callback: () => {
        this.loadFile(
          this.props.dataExport &&
            this.props.dataExport.substring(this.props.dataExport.lastIndexOf('.')),
          this.props.dataExport,
        );
      },
    });
  };

  /**
   * @description: This is a loading file for excel,pdf and csv.
   * @param {type} fileClass: type, filePath: url
   * @return: undefined
   */
  loadFile = (fileClass, filePath) => {
    const url = `/superlop/restv2/admin/v2.0/bayconnect.superlop.file_download_quick.json?fileClass=${fileClass}&filePath=${filePath}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = true;
    a.click();
  };

  exportDataCancel = () => {
    this.setState({
      exportDataVisible: false,
    });
  };

  customizeDisplay = () => {
    this.setState({
      customizeVisible: true,
    });
  };

  customizeConfirm = () => {
    const { tempColumns, columns, checkedValues } = this.state;
    const columnsValues = columns.map(element => element.key);
    const newColumns = Object.assign([], columns);
    if (checkedValues.length < 1) {
      message.warning('Please checked Column');
      return;
    }
    this.setState({
      customizeVisible: false,
    });
    checkedValues.map(element => {
      if (!columnsValues.includes(element)) {
        newColumns.push(tempColumns.filter(item => item.key === element)[0]);
      }
    });

    columnsValues.map(element => {
      if (element && !checkedValues.includes(element) && element !== 'index') {
        newColumns.splice(
          newColumns.indexOf(newColumns.filter(item => item.key === element)[0]),
          1,
        );
      }
    });
    newColumns.sort((o1, o2) => o1.index - o2.index);
    newColumns.forEach((element, index) => {
      element.fixed = '';
      element.width = '';
      if (index === 0) {
        element.width = 60;
      }
      if (newColumns.length > 5 && index === newColumns.length - 1) {
        element.width = 120;
      }
      if (newColumns.length > 5 && element.hasOwnProperty('date')) {
        element.width = 180;
      }
    });
    this.setState({
      columns: newColumns,
      checkedValues,
    });
  };

  customizeCancel = () => {
    const { columns } = this.state;
    const columnsValues = columns.map(element => element.key);
    this.setState({
      customizeVisible: false,
      checkedValues: columnsValues,
    });
  };

  onChangeCheckbox = newCheckedValues => {
    this.setState({
      checkedValues: newCheckedValues,
    });
  };

  onChangeExport = newExportTypes => {
    this.setState({
      exportTypes: newExportTypes,
    });
  };

  operatorReset = () => {
    this.auditLogForm.current.resetFields();
  };

  render() {
    const { loading } = this.props;
    let { getAuditLogList } = this.state;
    const {
      page,
      functionNameOptions,
      exportDataVisible,
      options,
      checkedValues,
      tempColumns,
    } = this.state;
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
              <span onClick={this.customizeDisplay}>
                <span className={styles.customizeDisplay}>Customize Display</span>
                <IconFont type="icon-setting" className={styles['btn-icon']} />
              </span>
            </Col>
          </Row>
          <Table
            loading={loading['auditLog/getAuditLogList']}
            dataSource={getAuditLogList}
            pagination={false}
            columns={this.state.columns}
            rowKey={Math.random().toString()}
            scroll={{ x: this.state.columns.length > 5 ? document.body.clientWidth : false }}
          />
          {getAuditLogList && getAuditLogList.length > 0 && (
            <Pagination
              showSizeChanger
              current={page.pageNumber}
              showTotal={() => `Total ${totalCount} items`}
              onShowSizeChange={this.onShowSizeChange}
              onChange={this.pageChange}
              total={totalCount}
              pageSize={page.pageSize}
            />
          )}
        </div>
        <Modal
          closable={false}
          wrapClassName={styles.customizeDisplayModal}
          title="Customize Display"
          visible={this.state.customizeVisible}
          onOk={this.customizeConfirm}
          onCancel={this.customizeCancel}
          cancelText={formatMessage({ id: 'app.common.cancel' })}
          okText={formatMessage({ id: 'app.common.submit' })}
        >
          <div>
            <p>
              Alter the display of the orders table by selecting up to{' '}
              <font style={{ color: '#0D87D4' }}>{tempColumns.length - 1}</font> Cloumns
            </p>
            <Checkbox.Group
              options={options}
              value={checkedValues}
              onChange={this.onChangeCheckbox}
            />
          </div>
        </Modal>
        <Modal
          closable={false}
          title="Select Export Format"
          visible={exportDataVisible}
          onOk={this.exportDataConfirm}
          onCancel={this.exportDataCancel}
          cancelText={formatMessage({ id: 'app.common.cancel' })}
          okText={formatMessage({ id: 'app.common.save' })}
        >
          <div>
            <Checkbox.Group onChange={this.onChangeExport}>
              <Checkbox value={1}>xlsx</Checkbox>
              <Checkbox value={2}>docx</Checkbox>
              <Checkbox value={3}>pdf</Checkbox>
              <Checkbox value={4}>csv</Checkbox>
            </Checkbox.Group>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default AuditTrailLogging;
