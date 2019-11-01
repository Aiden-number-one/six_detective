import React, { Component, Fragment } from 'react';
import { Form, Input, Button, DatePicker, Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import styles from './AuditLog.less';

class OperatorForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <div>
          <Form layout="inline">
            <Form.Item label="操作员名称：">
              {getFieldDecorator('operatorName', {})(<Input className={styles['input-value']} />)}
            </Form.Item>
            <Form.Item label="开始时间：">
              {getFieldDecorator('beginDate', {})(
                <DatePicker
                  onChange={this.changeBeginDate}
                  className={styles['input-value']}
                  format="YYYY-MM-DD"
                />,
              )}
            </Form.Item>
            <Form.Item label="结束时间：">
              {getFieldDecorator('endDate', {})(
                <DatePicker
                  onChange={this.changeEndDate}
                  className={styles['input-value']}
                  format="YYYY-MM-DD"
                />,
              )}
            </Form.Item>
          </Form>
        </div>
      </Fragment>
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
  };

  auditLogForm = React.createRef();

  componentDidMount() {
    this.getAuditLog();
  }

  getAuditLog = (operatorName, beginDate, endDate) => {
    const param = {
      pageNumber: '1',
      pageSize: '10',
      operatorName,
      beginDate,
      endDate,
    };
    console.log('param=', param);
    const { dispatch } = this.props;
    dispatch({
      type: 'auditLog/getAuditLogList',
      payload: param,
    });
  };

  changeBeginDate = () => {};

  changeEndDate = () => {};

  queryLog = () => {
    this.auditLogForm.current.validateFields((err, values) => {
      console.log('values====', values);
      let beginDate = values.beginDate ? moment(values.beginDate).format('YYYY-MM-DD') : '';
      beginDate = beginDate.split('-').join('');
      let endDate = values.endDate ? moment(values.endDate || '').format('YYYY-MM-DD') : '';
      endDate = endDate.split('-').join('');
      this.getAuditLog(values.operatorName, beginDate, endDate);
    });
  };

  render() {
    return (
      <Fragment>
        <div>
          <NewOperatorForm ref={this.auditLogForm}></NewOperatorForm>
          <Button type="primary" onClick={() => this.queryLog()}>
            查询
          </Button>
          <Table
            dataSource={this.props.getAuditLogListData.resultList}
            pagination={{ pageSize: 5 }}
            columns={this.state.columns}
          ></Table>
        </div>
      </Fragment>
    );
  }
}

export default AuditLog;
