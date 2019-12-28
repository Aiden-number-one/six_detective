import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, DatePicker } from 'antd';
import { formatMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';

const { RangePicker } = DatePicker;

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search, exportData } = this.props;
    return (
      <Form className="ant-advanced-search-form search-wraper" layout="vertical">
        <Row gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }} align="bottom" type="flex">
          <Col xs={24} sm={12} xl={10} xxl={8}>
            <Form.Item label={formatMessage({ id: 'systemManagement.auditLog.logDate' })}>
              {getFieldDecorator(
                'logDate',
                {},
              )(<RangePicker format="DD-MMM-YYYY" placeholder={['Start Date', 'End Date']} />)}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={7} xxl={5}>
            <Form.Item label={formatMessage({ id: 'systemManagement.auditLog.updatedBy' })}>
              {getFieldDecorator('updatedBy', {})(<Input placeholder="Please input" />)}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={7} xxl={5}>
            <Form.Item label={formatMessage({ id: 'systemManagement.auditLog.functionName' })}>
              {getFieldDecorator('functionName', {})(<Input placeholder="Please input" />)}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={8} xxl={6}>
            <Form.Item>
              <Button type="primary" onClick={search}>
                <IconFont type="iconsousuo" style={{ color: '#fff' }} />
                {formatMessage({ id: 'app.common.search' })}
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                type="primary"
                onClick={exportData}
                className="btn_usual"
                icon="export"
              >
                {formatMessage({ id: 'app.common.export' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {/* <div className="btnArea">
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
        </div> */}
      </Form>
    );
  }
}
