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
          <Form>
            <Form.Item label="操作员名称：">
              {getFieldDecorator('operatorName', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your operatorName',
                  },
                ],
              })(<Input className={styles['input-value']} />)}
            </Form.Item>
            <Form.Item label="开始时间：">
              {getFieldDecorator('beginDate', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your beginDate',
                  },
                ],
              })(
                <DatePicker
                  onChange={this.changeBeginDate}
                  className={styles['input-value']}
                  format="YYYY-MM-DD"
                />,
              )}
            </Form.Item>
            <Form.Item label="结束时间：">
              {getFieldDecorator('endDate', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your beginDate',
                  },
                ],
              })(
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
    getAuditLogListData: [
      {
        index: 1,
        operatorTime: '2019-08-22',
        operatorName: '李四1111',
        businessName: 'aaa',
        status: '成功',
        returnInfo: '认证成功',
        visitIp: '192.168.2.3',
      },
      {
        index: 2,
        operatorTime: '2019-08-22',
        operatorName: '张三',
        businessName: 'aaa',
        status: '成功',
        returnInfo: '认证成功',
        visitIp: '192.168.2.3',
      },
      {
        index: 3,
        operatorTime: '2019-08-22',
        operatorName: '张三',
        businessName: 'aaa',
        status: '成功',
        returnInfo: '认证成功',
        visitIp: '192.168.2.3',
      },
      {
        index: 4,
        operatorTime: '2019-08-22',
        operatorName: '张三',
        businessName: 'aaa',
        status: '成功',
        returnInfo: '认证成功',
        visitIp: '192.168.2.3',
      },
      {
        index: 5,
        operatorTime: '2019-08-22',
        operatorName: '张三',
        businessName: 'aaa',
        status: '成功',
        returnInfo: '认证成功',
        visitIp: '192.168.2.3',
      },
      {
        index: 6,
        operatorTime: '2019-08-22',
        operatorName: '张三',
        businessName: 'aaa',
        status: '成功',
        returnInfo: '认证成功',
        visitIp: '192.168.2.3',
      },
    ],
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '操作时间',
        dataIndex: 'operatorTime',
        key: 'operatorTime',
      },
      {
        title: '操作员名称',
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '业务名称',
        dataIndex: 'businessName',
        key: 'businessName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '返回信息',
        dataIndex: 'returnInfo',
        key: 'returnInfo',
      },
      {
        title: '来访IP',
        dataIndex: 'visitIp',
        key: 'visitIp',
      },
    ],
  };

  auditLogForm = React.createRef();

  componentDidMount() {
    // this.getAuditLog();
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
      this.getAuditLog(
        values.operatorName,
        moment(values.beginDate).format('YYYY-MM-DD'),
        moment(values.endDate).format('YYYY-MM-DD'),
      );
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
            dataSource={this.state.getAuditLogListData}
            pagination={{ pageSize: 5 }}
            columns={this.state.columns}
          ></Table>
        </div>
      </Fragment>
    );
  }
}

export default AuditLog;
