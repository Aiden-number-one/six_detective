import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../UserMaintenance.less';
import IconFont from '@/components/IconFont';

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search } = this.props;
    return (
      <Form className="ant-advanced-search-form search-wraper" layout="vertical">
        <Row gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }} align="bottom" type="flex">
          {/* <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'app.common.userId' })}>
              {getFieldDecorator('userId', {})(
                <Input className={styles.inputvalue} placeholder="Please input" />,
              )}
            </Form.Item>
          </Col> */}
          <Col xs={24} sm={12} xl={7} xxl={5}>
            <Form.Item label={formatMessage({ id: 'app.common.username' })}>
              {getFieldDecorator(
                'userName',
                {},
              )(<Input className={styles.inputvalue} placeholder="Please input" />)}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={7} xxl={5}>
            <Form.Item>
              <Button type="primary" onClick={search}>
                <IconFont type="iconsousuo" style={{ color: '#fff' }} />
                {formatMessage({ id: 'app.common.search' })}
              </Button>
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
        {/* <div className="btnArea">
          <Button type="primary" onClick={search}>
            {formatMessage({ id: 'app.common.search' })}
          </Button>
        </div> */}
      </Form>
    );
  }
}
