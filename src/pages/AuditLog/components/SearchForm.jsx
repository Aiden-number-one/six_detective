import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, DatePicker } from 'antd';
import { formatMessage } from 'umi/locale';

const { RangePicker } = DatePicker;

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search, exportData } = this.props;
    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }}>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'systemManagement.auditLog.logDate' })}>
              {getFieldDecorator(
                'logDate',
                {},
              )(<RangePicker format="YYYY-MM-DD" placeholder={['Start Date', 'End Date']} />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'systemManagement.auditLog.updatedBy' })}>
              {getFieldDecorator('updatedBy', {})(<Input placeholder="Please input" />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'systemManagement.auditLog.functionName' })}>
              {getFieldDecorator('functionName', {})(<Input placeholder="Please input" />)}
            </Form.Item>
          </Col>
        </Row>
        <div className="btnArea">
          <Button
            type="primary"
            onClick={exportData}
            className="btn_usual"
            style={{ height: '36px' }}
          >
            {formatMessage({ id: 'app.common.export' })}
          </Button>
          <Button type="primary" onClick={search}>
            {formatMessage({ id: 'app.common.search' })}
          </Button>
        </div>
      </Form>
    );
  }
}
