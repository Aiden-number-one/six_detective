import React, { PureComponent, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Select, Form, Input, Button, DatePicker, Table, Row, Col } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
import styles from './ApprovalEheck.less';

import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
@connect(({ approvalCheck, loading }) => ({
  checkColumns: approvalCheck.checkColumns,
  loading: loading.effects['approvalCheck/approvalCheckDatas'],
  approvalData: approvalCheck.data,
}))
class ApprovalEheck extends PureComponent {
  state = {};

  componentDidMount() {
    this.props.form.validateFields();
    this.checkData();
  }

  // 获取查询列表数据
  checkData = param => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approvalCheck/approvalCheckDatas',
      payload: param,
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const startDate = values.approvalDate
          ? moment(values.approvalDate[0]).format('YYYYMMDD')
          : '';
        const endDate = values.approvalDate
          ? moment(values.approvalDate[1]).format('YYYYMMDD')
          : '';
        const param = {
          pageNumber: '1',
          pageSize: '10',
          businessCode: values.businessCode,
          procInstStatus: values.procInstStatus,
          businessInfo: values.businessInfo,
          startDate,
          endDate,
        };
        this.checkData(param);
      }
    });
  };

  render() {
    // const { dataSource } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { approvalData = {} } = this.props;
    const dataSource = approvalData.items;
    const checkColumns = [
      {
        title: '审批号',
        dataIndex: 'procInst',
        align: 'center',
      },
      {
        title: '业务名称',
        dataIndex: 'taskName',
        align: 'center',
      },
      {
        title: '业务说明',
        dataIndex: 'businessInfo',
        align: 'center',
      },
      {
        title: '发起人',
        dataIndex: 'createrName',
        align: 'center',
      },
      {
        title: '审批日期',
        dataIndex: 'period',
        align: 'center',
      },
      {
        title: '审批时间',
        dataIndex: 'LASTUPDATETIME',
        align: 'center',
      },
      {
        title: '审批状态',
        dataIndex: 'procInstStatusName',
        align: 'center',
      },
    ];
    const rangeConfig = {
      rules: [{ type: 'array', required: false, message: '请选择时间' }],
    };

    return (
      <Fragment>
        <PageHeaderWrapper>
          <div className={styles.approvalCheck}>
            <Form onSubmit={this.handleSubmit} className="ant-advanced-search-form">
              <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }}>
                <Col xs={12} sm={12} lg={8}>
                  <Form.Item label="业务名称" colon={false} hasFeedback>
                    {getFieldDecorator('businessCode', {
                      rules: [{ required: false, message: '请选择业务名称' }],
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="1001">任务发布审批流程</Option>
                        <Option value="1002">任务填报流程</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12} lg={8}>
                  <Form.Item label="审批状态" hasFeedback>
                    {getFieldDecorator('procInstStatus', {
                      rules: [{ required: false, message: '请选审批状态' }],
                      initialValue: '',
                    })(
                      <Select>
                        <Option value="">全部</Option>
                        <Option value="0">审批中</Option>
                        <Option value="1">已完成</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12} lg={8}>
                  <Form.Item label="业务说明:">
                    {getFieldDecorator('businessInfo', {
                      rules: [{ required: false, message: '请输入说明' }],
                    })(<Input placeholder="请输入说明" />)}
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12} lg={8}>
                  <Form.Item label="审批日期:">
                    {getFieldDecorator('approvalDate', rangeConfig)(<RangePicker />)}
                  </Form.Item>
                </Col>
              </Row>
              <div className="btnArea">
                <Button type="primary" icon="close" onClick={this.handleReset}>
                  重置
                </Button>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </div>
            </Form>
            <Table
              columns={checkColumns}
              dataSource={dataSource}
              className={styles.tableBox}
              pagination={{
                size: 'small',
              }}
            />
          </div>
        </PageHeaderWrapper>
      </Fragment>
    );
  }
}

const ApprovalEheckForm = Form.create()(ApprovalEheck);

export default ApprovalEheckForm;
