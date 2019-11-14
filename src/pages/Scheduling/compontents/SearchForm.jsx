import React, { Component } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Select } from 'antd';

import styles from '../Scheduling.less';

// const { RangePicker } = DatePicker;
const { Option } = Select;

class SearchForm extends Component {
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
export default Form.create({})(SearchForm);
