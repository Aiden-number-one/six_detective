import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, DatePicker, Table, Row, Col, Pagination } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';

import styles from './AuditLog.less';

class OperatorForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { search } = this.props;
    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }}>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'app.common.username' })}>
              {getFieldDecorator('operatorName', {})(<Input className={styles.inputvalue} />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'app.common.dateFrom' })}>
              {getFieldDecorator('beginDate', {})(
                <DatePicker
                  onChange={this.changeBeginDate}
                  className={styles.inputvalue}
                  format="YYYY-MM-DD"
                  placeholder=""
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'app.common.dateTo' })}>
              {getFieldDecorator('endDate', {})(
                <DatePicker
                  onChange={this.changeEndDate}
                  className={styles.inputvalue}
                  format="YYYY-MM-DD"
                  placeholder=""
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <div className="btnArea">
          <Button type="primary" onClick={search}>
            {formatMessage({ id: 'app.common.search' })}
          </Button>
        </div>
      </Form>
    );
  }
}
const NewOperatorForm = Form.create({})(OperatorForm);

@connect(({ auditLog, loading }) => ({
  loading: loading.effects,
  getAuditLogListData: auditLog.data,
}))
class AuditLog extends Component {
  state = {
    pageNum: '1',
    pageSize: '10',
    page: {
      pageNumber: 1,
      pageSize: 10,
    },
    columns: [
      {
        title: formatMessage({ id: 'app.common.number' }),
        dataIndex: 'index',
        key: 'index',
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

  getAuditLog = (operatorName = '', beginDate = '', endDate = '') => {
    const param = {
      pageNumber: `${this.state.pageNum}`,
      pageSize: `${this.state.pageSize}`,
      operatorName,
      beginDate,
      endDate,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'auditLog/getAuditLogList',
      payload: param,
    });
  };

  pageChange = pagination => {
    this.setState(
      {
        pageNum: `${pagination.current}`,
        pageSize: pagination.pageSize,
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
      let beginDate = values.beginDate ? moment(values.beginDate).format('YYYY-MM-DD') : '';
      beginDate = beginDate.split('-').join('');
      let endDate = values.endDate ? moment(values.endDate || '').format('YYYY-MM-DD') : '';
      endDate = endDate.split('-').join('');
      this.getAuditLog(values.operatorName, beginDate, endDate);
    });
  };

  operatorReset = () => {
    this.auditLogForm.current.resetFields();
  };

  render() {
    const { loading } = this.props;
    let { getAuditLogList } = this.state;
    const { pageSize, page } = this.state;
    getAuditLogList = this.props.getAuditLogListData.items;
    const totalCount = this.props.getAuditLogListData && this.props.getAuditLogListData.totalCount;
    // eslint-disable-next-line no-unused-expressions
    getAuditLogList &&
      getAuditLogList.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index = (this.state.pageNum - 1) * pageSize + index + 1;
      });
    return (
      <PageHeaderWrapper>
        <NewOperatorForm
          search={this.queryLog}
          reset={this.operatorReset}
          ref={this.auditLogForm}
        />
        <Table
          loading={loading['auditLog/getAuditLogList']}
          dataSource={getAuditLogList}
          pagination={{ total: totalCount, pageSize }}
          onChange={this.pageChange}
          columns={this.state.columns}
        />
        <Pagination
          showSizeChanger
          current={page.pageNumber}
          showTotal={() =>
            `Page ${page.pageNumber.toString()} of ${Math.ceil(
              totalCount / page.pageSize,
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
