import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search } = this.props;
    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={{ xs: 20, sm: 20 }}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'systemManagement.userMaintenance.name' })}>
              {getFieldDecorator('sqlName', {})(<Input placeholder="Please input" />)}
            </Form.Item>
          </Col>
        </Row>
        <div className="btnArea">
          <Button type="primary" onClick={search}>
            {formatMessage({ id: 'app.common.search' })}
          </Button>
        </div>
      </Form>
    );
  }
}
