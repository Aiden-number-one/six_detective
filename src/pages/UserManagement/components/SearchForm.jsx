import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../UserManagement.less';

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search, reset } = this.props;
    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }}>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'app.common.userId' })}>
              {getFieldDecorator('userId', {})(<Input className={styles.inputvalue} />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'app.common.username' })}>
              {getFieldDecorator('username', {})(<Input className={styles.inputvalue} />)}
            </Form.Item>
          </Col>
          {/*
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label="公司部门：">
              {getFieldDecorator('displaypath', {})(<Input className={styles.inputvalue} />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'app.common.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                ],
              })(<Input className={styles.inputvalue} />)}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.userMaintenance.lockedStatus' })}
            >
              {getFieldDecorator('custStatus', {
                initialValue: '',
              })(
                <Select>
                  <Option value="">请选择</Option>
                  <Option value="0">正常</Option>
                  <Option value="3">销户</Option>
                  <Option value="1">锁定</Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          */}
        </Row>
        <div className="btnArea">
          <Button icon="close" onClick={reset}>
            Reset
          </Button>
          <Button type="primary" onClick={search}>
            {formatMessage({ id: 'app.common.search' })}
          </Button>
        </div>
      </Form>
    );
  }
}
