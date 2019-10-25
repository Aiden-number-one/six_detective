import React, { PureComponent, Fragment } from 'react';
import { Select, Form, Icon, Input, Button, DatePicker, Divider, Table } from 'antd';
import { connect } from 'dva';
// import classNames from 'classnames';
import styles from './ApprovalEheck.less';

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
  // 生成模拟数据Data
  // createData = () => {
  //   const data = [];
  //   for (let i = 0; i < 46; i += 1) {
  //     data.push({
  //       key: i,
  //       name: `Edward King ${i}`,
  //       age: 32,
  //       tel: '0571-22098909',
  //       phone: 18889898989,
  //       checkStatus: '审批中',
  //       date: '2019-10-23',
  //       address: `London, Park Lane no. ${i}`,
  //     });
  //   }
  //   this.setState({
  //     dataSource: data,
  //   });
  // };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.checkData();
      }
    });
  };

  render() {
    // const { dataSource } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { approvalData = {} } = this.props;
    const dataSource = approvalData.resultList;
    const checkColumns = [
      {
        title: '审批号',
        dataIndex: 'businessCode',
        align: 'center',
      },
      {
        title: '业务名称',
        dataIndex: 'createrName',
        align: 'center',
      },
      {
        title: '业务说明',
        dataIndex: 'procDef',
        align: 'center',
      },
      {
        title: '发起人',
        dataIndex: 'taskName',
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
        <div className={styles.approvalCheck}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <Icon type="unordered-list" className={styles.icon} />
              <h2 className={styles.titleText}>审批查询</h2>
            </div>
            <Divider className={styles.divider} />
          </div>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="业务名称" hasFeedback>
              {getFieldDecorator('approvalProcessSelect', {
                rules: [{ required: false, message: '请选择业务名称' }],
                initialValue: 'approvalProcessAll',
              })(
                <Select style={{ width: 180 }}>
                  <Option value="approvalProcessAll">全部</Option>
                  <Option value="approvalProcess">任务发布审批流程</Option>
                  <Option value="fillingProcess">任务填报流程</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="审批状态" hasFeedback>
              {getFieldDecorator('approvalStatusSelect', {
                rules: [{ required: false, message: '请选审批状态' }],
                initialValue: 'approvalStatusAll',
              })(
                <Select style={{ width: 180 }}>
                  <Option value="approvalStatusAll">全部</Option>
                  <Option value="approvalStatusIn">审批中</Option>
                  <Option value="approvalStatusDone">已完成</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="业务说明:">
              {getFieldDecorator('businesDescription', {
                rules: [{ required: false, message: '请输入说明' }],
              })(<Input placeholder="请输入说明" />)}
            </Form.Item>
            <br />
            <Form.Item label="审批日期:" style={{ marginTop: '5px' }}>
              {getFieldDecorator('range-picker', rangeConfig)(<RangePicker />)}
            </Form.Item>
            <Form.Item style={{ marginTop: '5px' }}>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                查询
              </Button>
            </Form.Item>
            <Form.Item style={{ marginTop: '5px' }}>
              <Button
                type="primary"
                icon="close"
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                重置
              </Button>
            </Form.Item>
          </Form>
          <Table
            columns={checkColumns}
            dataSource={dataSource}
            bordered
            className={styles.tableBox}
          />
        </div>
      </Fragment>
    );
  }
}

const ApprovalEheckForm = Form.create()(ApprovalEheck);

export default ApprovalEheckForm;
