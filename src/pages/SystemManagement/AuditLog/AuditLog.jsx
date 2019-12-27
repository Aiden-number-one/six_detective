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
import IconFont from '@/components/IconFont';

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
        fixed: 'left',
      },
      {
        key: 'functionName',
        visible: true,
        fixed: 'left',
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
        fixed: 'right',
      },
    ],
    columns: [
      {
        index: 0,
        title: formatMessage({ id: 'app.common.number' }),
        dataIndex: 'index',
        key: 'index',
        width: 60,
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
        width: 120,
      },
      {
        index: 2,
        title: formatMessage({ id: 'systemManagement.auditLog.tableName' }),
        dataIndex: 'tableName',
        key: 'tableName',
        ellipsis: true,
        width: 120,
        colSpan: 1,
      },
      {
        index: 3,
        title: formatMessage({ id: 'systemManagement.auditLog.BITOCode' }),
        dataIndex: 'biToCode',
        key: 'biToCode',
      },
      {
        index: 4,
        title: formatMessage({ id: 'systemManagement.auditLog.productCode' }),
        dataIndex: 'productCode',
        key: 'productCode',
      },
      {
        index: 5,
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
        index: 6,
        title: formatMessage({ id: 'systemManagement.auditLog.fieldUpdated' }),
        dataIndex: 'filedUpdated',
        key: 'filedUpdated',
      },
      {
        index: 7,
        title: formatMessage({ id: 'systemManagement.auditLog.updateType' }),
        dataIndex: 'updateType',
        key: 'updateType',
      },
      {
        index: 8,
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
        index: 9,
        title: formatMessage({ id: 'systemManagement.auditLog.updatedBy' }),
        dataIndex: 'updatedBy',
        key: 'updatedBy',
      },
      {
        index: 10,
        title: formatMessage({ id: 'systemManagement.auditLog.before' }),
        dataIndex: 'before',
        key: 'before',
      },
      {
        index: 11,
        title: formatMessage({ id: 'systemManagement.auditLog.after' }),
        dataIndex: 'after',
        key: 'after',
        width: 100,
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
    this.setState({
      tempColumns: columns,
      columns: newColumns,
      checkedValues,
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
    this.setState({
      customizeVisible: true,
    });
  };

  customizeConfirm = () => {
    const { tempColumns, columns, checkedValues } = this.state;
    this.setState({
      customizeVisible: false,
    });
    const columnsValues = columns.map(element => element.key);
    const newColumns = Object.assign([], columns);
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
      if (Object.hasOwnProperty(element.fixed)) {
        delete element.fixed;
      }
      if (index < 2) {
        element.fixed = 'left';
      }
      if (index === newColumns.length - 1) {
        element.fixed = 'right';
      }
    });
    this.setState({
      columns: newColumns,
      checkedValues,
    });
    console.log('newColumns===', newColumns);
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
            scroll={{ x: 1300 }}
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
