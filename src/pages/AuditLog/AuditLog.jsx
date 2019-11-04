import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, DatePicker, Table, Row, Col } from 'antd';
import { connect } from 'dva';
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
            <Form.Item label="操作员名称：">
              {getFieldDecorator('operatorName', {})(<Input className={styles['input-value']} />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="开始时间：">
              {getFieldDecorator('beginDate', {})(
                <DatePicker
                  onChange={this.changeBeginDate}
                  className={styles['input-value']}
                  format="YYYY-MM-DD"
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="结束时间：">
              {getFieldDecorator('endDate', {})(
                <DatePicker
                  onChange={this.changeEndDate}
                  className={styles['input-value']}
                  format="YYYY-MM-DD"
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <div className="btnArea">
          <Button type="primary" onClick={search}>
            Search
          </Button>
        </div>
      </Form>
    );
  }
}
const NewOperatorForm = Form.create({})(OperatorForm);

@connect(({ auditLog, loading }) => ({
  loading: loading.effects['auditLog/getAuditLogList'],
  getAuditLogListData: auditLog.data,
}))
class AuditLog extends Component {
  state = {
    pageNum: '1',
    pageSize: '10',
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '操作时间',
        dataIndex: 'runtime',
        key: 'runtime',
      },
      {
        title: '操作员名称',
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '业务名称',
        dataIndex: 'bexDesc',
        key: 'bexDesc',
      },
      {
        title: '状态',
        dataIndex: 'errCodeName',
        key: 'errCodeName',
      },
      {
        title: '返回信息',
        dataIndex: 'errorCodeMessage',
        key: 'errorCodeMessage',
      },
      {
        title: '来访IP',
        dataIndex: 'ipAddress',
        key: 'ipAddress',
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
      pageNumber: this.state.pageNum,
      pageSize: this.state.pageSize,
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

  render() {
    let { getAuditLogList } = this.state;
    const { pageSize } = this.state;
    getAuditLogList = this.props.getAuditLogListData.resultList;
    const totalCount = this.props.getAuditLogListData.totalRows;
    // eslint-disable-next-line no-unused-expressions
    getAuditLogList &&
      getAuditLogList.forEach((element, index) => {
        // eslint-disable-next-line no-param-reassign
        element.index = (this.state.pageNum - 1) * pageSize + index + 1;
      });
    return (
      <PageHeaderWrapper>
        <NewOperatorForm search={this.queryLog} ref={this.auditLogForm} />
        <Table
          dataSource={getAuditLogList}
          pagination={{ total: totalCount, pageSize }}
          onChange={this.pageChange}
          columns={this.state.columns}
        ></Table>
      </PageHeaderWrapper>
    );
  }
}

export default AuditLog;
