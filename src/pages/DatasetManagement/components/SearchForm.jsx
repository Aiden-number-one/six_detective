import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';

import IconFont from '@/components/IconFont';

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search } = this.props;
    return (
      <Form className="ant-advanced-search-form" style={{ flex: 1 }}>
        <Row
          gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }}
          align="middle"
          type="flex"
          justify="end"
        >
          <Col xl={8}>
            <Form.Item>
              {getFieldDecorator(
                'datasetName',
                {},
              )(<Input placeholder="Please input report name" />)}
            </Form.Item>
          </Col>
          <Col xl={5}>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  search('new');
                }}
              >
                <IconFont type="iconsousuo" style={{ color: '#fff' }} />
                {formatMessage({ id: 'app.common.search' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
