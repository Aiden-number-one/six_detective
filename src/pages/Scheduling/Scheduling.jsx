import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Button, DatePicker, Table, Row, Col, Select, Switch, Modal } from 'antd';
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
              {getFieldDecorator('operationType', {
                rules: [{ required: false, message: '请选择业务名称' }],
                initialValue: 'scheduleName',
              })(
                <Select>
                  <Option value="scheduleName">计划名称</Option>
                  <Option value="jobName">作业名称</Option>
                  <Option value="jobNo">作业编号</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="操作值:">
              {getFieldDecorator('operationName', {
                rules: [{ required: false, message: '请输入操作值' }],
              })(<Input placeholder="" />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="最后一次执行状态">
              {getFieldDecorator('lastExecState', {
                rules: [{ required: false, message: '请选择状态' }],
                initialValue: '',
              })(
                <Select>
                  <Option value="">请选择</Option>
                  <Option value="S">成功完成</Option>
                  <Option value="F">出错完成</Option>
                  <Option value="R">执行中</Option>
                  <Option value="U">未执行</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="上次执行时间：">
              {getFieldDecorator('startTime', {})(
                <DatePicker
                  onChange={this.changeBeginDate}
                  className={styles.inputvalue}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="结束时间：">
              {getFieldDecorator('endTime', {})(
                <DatePicker onChange={this.changeEndDate} className={styles.inputvalue} showTime />,
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
    otherParam: {},
    selectedRows: [],
    modifyVisible: false,
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
        dataIndex: 'modifiedTime',
        key: 'modifiedTime',
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
        dataIndex: 'startFlag',
        key: 'startFlag',
        render: (text, record) => ({
          children: (
            <Switch
              checkedChildren="NO"
              unCheckedChildren="OFF"
              // onChange={() => this.handleSetConfigStatus(record)}
              defaultChecked={record.startFlag === '2'}
            />
          ),
        }),
      },
    ],
  };

  auditLogForm = React.createRef();

  componentDidMount() {
    this.getSchedul();
  }

  // 分页查询调度计划列表
  getSchedul = (otherParam = {}) => {
    const param = {
      pageNumber: `${this.state.pageNum}`,
      pageSize: `${this.state.pageSize}`,
    };
    Object.assign(param, otherParam);
    const { dispatch } = this.props;
    dispatch({
      type: 'schedule/getScheduleList',
      payload: param,
    });
  };

  // 切换分页
  pageChange = pagination => {
    const { otherParam } = this.state;
    this.setState(
      {
        pageNum: `${pagination.current}`,
        pageSize: pagination.pageSize,
      },
      () => {
        this.getSchedul(otherParam);
      },
    );
  };

  // 搜索查询列表
  queryScheduleList = () => {
    this.auditLogForm.current.validateFields((err, values) => {
      const startTime = values.startTime ? moment(values.startTime).format('YYYYMMDDHHmmss') : '';
      const endTime = values.endTime ? moment(values.endTime || '').format('YYYYMMDDHHmmss') : '';
      const type = values.operationType;
      const otherParam = {
        [type]: values.operationName,
        lastExecState: values.lastExecState,
        startTime,
        endTime,
      };
      this.setState({
        otherParam,
      });
      this.getSchedul(otherParam);
    });
  };

  // 重置
  operatorReset = () => {
    this.auditLogForm.current.resetFields();
  };

  // 选择表格行，checkbox
  selectedRow = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
    });
  };

  //  批量删除调度计划
  deleteScheduleRow = () => {
    const { selectedRows } = this.state;
    const scheduleIdList = selectedRows.map(item => item.scheduleId);
    const scheduleIdString = scheduleIdList.join(',');
    // console.log('scheduleIdString---->', scheduleIdString);
    const { dispatch } = this.props;
    dispatch({
      type: 'schedule/deleteScheduleBatch',
      payload: {
        scheduleId: scheduleIdString,
      },
      callback: this.getSchedul,
    });
  };

  modifySchedule = () => {
    this.setState({
      modifyVisible: true,
    });
  };

  modifyConfirm = () => {
    this.setState({
      modifyVisible: false,
    });
  };

  modifyCancel = () => {
    this.setState({
      modifyVisible: false,
    });
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
    const rowSelection = {
      type: 'checkbox',
      onChange: this.selectedRow,
    };
    return (
      <PageHeaderWrapper>
        <NewOperatorForm
          search={this.queryScheduleList}
          reset={this.operatorReset}
          ref={this.auditLogForm}
        />
        <TableHeader
          showEdit
          showSelect
          editTableData={this.modifySchedule}
          deleteTableData={this.deleteScheduleRow}
        />
        <Table
          dataSource={scheduleList}
          pagination={{ total: totalCount, pageSize, showSizeChanger: true }}
          onChange={this.pageChange}
          columns={this.state.columns}
          rowSelection={rowSelection}
        />
        <Modal
          title="修改调度计划"
          visible={this.state.modifyVisible}
          onOk={this.modifyConfirm}
          onCancel={this.modifyCancel}
        ></Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Scheduling;
