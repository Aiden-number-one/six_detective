import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../MessageContentTemplate.less';
import IconFont from '@/components/IconFont';

const { Option } = Select;

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { typeOptions, search } = this.props;
    return (
      <Form className="ant-advanced-search-form search-wraper">
        <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }} align="middle" type="flex">
          <Col xs={12} sm={12} lg={8} xxl={6}>
            <Form.Item label={formatMessage({ id: 'systemManagement.template.templateName' })}>
              {getFieldDecorator(
                'templateName',
                {},
              )(
                <Input
                  className={styles.inputvalue}
                  placeholder={`Please Input ${formatMessage({
                    id: 'systemManagement.template.templateName',
                  })}`}
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8} xxl={6}>
            <Form.Item label={formatMessage({ id: 'systemManagement.template.templateId' })}>
              {getFieldDecorator(
                'templateId',
                {},
              )(
                <Input
                  className={styles.inputvalue}
                  placeholder={`Please Input ${formatMessage({
                    id: 'systemManagement.template.templateId',
                  })}`}
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8} xxl={6}>
            <Form.Item label={formatMessage({ id: 'systemManagement.template.templateType' })}>
              {getFieldDecorator('type', {
                initialValue: '',
              })(
                <Select className={styles.inputvalue} placeholder="Please Select">
                  {typeOptions.map(item => (
                    <Option key={item.key} value={item.value}>
                      {item.title}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8} xxl={6}>
            <Button type="primary" onClick={search}>
              <IconFont type="iconsousuo" style={{ color: '#fff' }} />
              {formatMessage({ id: 'app.common.search' })}
            </Button>
          </Col>
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
