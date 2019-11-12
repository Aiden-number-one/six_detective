import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, DatePicker, Table, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import TableHeader from '@/components/TableHeader';

import styles from './Scheduling.less';

const { Option } = Select;
class OperatorForm extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { search, reset } = this.props;
    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }}>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="选择操作类型">
              {getFieldDecorator('businessCode', {
                rules: [{ required: false, message: '请选择业务名称' }],
                initialValue: '',
              })(
                <Select>
                  <Option value="">计划名称</Option>
                  <Option value="1001">作业名称</Option>
                  <Option value="1002">作业变化</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="操作值:">
              {getFieldDecorator('businessInfo', {
                rules: [{ required: false, message: '请输入操作值' }],
              })(<Input placeholder="" />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="最后一次执行状态">
              {getFieldDecorator('businessCode', {
                rules: [{ required: false, message: '请选择状态' }],
                initialValue: '',
              })(
                <Select>
                  <Option value="">请选择</Option>
                  <Option value="1001">成功完成</Option>
                  <Option value="1002">出错完成</Option>
                  <Option value="1003">执行中</Option>
                  <Option value="1004">未执行</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="上次执行时间：">
              {getFieldDecorator('beginDate', {})(
                <DatePicker
                  onChange={this.changeBeginDate}
                  className={styles.inputvalue}
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
                  className={styles.inputvalue}
                  format="YYYY-MM-DD"
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <div className="btnArea">
          <Button icon="close" onClick={reset}>
            重置
          </Button>
          <Button type="primary" onClick={search}>
            Search
          </Button>
        </div>
      </Form>
    );
  }
}
const NewOperatorForm = Form.create({})(OperatorForm);

@connect(({ schedule, loading }) => ({
  loading: loading.effects['schedule/getScheduleList'],
  scheduleListData: schedule.scheduleList,
}))
class Scheduling extends Component {
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
        title: '计划名称',
        dataIndex: 'scheduleName',
        key: 'scheduleName',
      },
      {
        title: '作业编号',
        dataIndex: 'jobNo',
        key: 'jobNo',
      },
      {
        title: '文件名',
        dataIndex: 'folderName',
        key: 'folderName',
      },
      {
        title: '作业名称',
        dataIndex: 'jobName',
        key: 'jobName',
      },
      {
        title: '上次执行时间',
        dataIndex: 'beforeTime',
        key: 'beforeTime',
      },
      {
        title: '最后一次执行状态',
        dataIndex: 'lastExecStateName',
        key: 'lastExecStateName',
      },
      {
        title: '下次执行时间',
        dataIndex: 'nextTime',
        key: 'nextTime',
      },
      {
        title: '执行结果',
        dataIndex: 'scheduleLog',
        key: 'scheduleLog',
      },
      {
        title: '操作',
        dataIndex: 'ipAddress',
        key: 'ipAddress',
      },
    ],
  };

  auditLogForm = React.createRef();

  componentDidMount() {
    this.getSchedul();
  }

  getSchedul = (lastExecState = '', startTime = '', endTime = '') => {
    const param = {
      pageNumber: `${this.state.pageNum}`,
      pageSize: `${this.state.pageSize}`,
      lastExecState,
      startTime,
      endTime,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'schedule/getScheduleList',
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
        this.getSchedul();
      },
    );
  };

  changeBeginDate = () => {};

  changeEndDate = () => {};

  queryScheduleList = () => {
    this.auditLogForm.current.validateFields((err, values) => {
      let beginDate = values.beginDate ? moment(values.beginDate).format('YYYY-MM-DD') : '';
      beginDate = beginDate.split('-').join('');
      let endDate = values.endDate ? moment(values.endDate || '').format('YYYY-MM-DD') : '';
      endDate = endDate.split('-').join('');
      // this.getAuditLog(values.operatorName, beginDate, endDate);
      console.log('values-->', values, beginDate, endDate);
    });
  };

  operatorReset = () => {
    this.auditLogForm.current.resetFields();
  };

  render() {
    const { scheduleListData } = this.props;
    const { pageSize } = this.state;
    const scheduleList = scheduleListData.items;
    const totalCount = scheduleListData && scheduleListData.totalCount;
    // eslint-disable-next-line no-unused-expressions
    scheduleList &&
      scheduleList.forEach((item, index) => {
        item.index = (this.state.pageNum - 1) * pageSize + index + 1;
      });
    return (
      <PageHeaderWrapper>
        <NewOperatorForm
          search={this.queryScheduleList}
          reset={this.operatorReset}
          ref={this.auditLogForm}
        />
        <TableHeader showEdit showSelect />
        <Table
          dataSource={scheduleList}
          pagination={{ total: totalCount, pageSize, showSizeChanger: true }}
          // onChange={this.pageChange}
          columns={this.state.columns}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Scheduling;
