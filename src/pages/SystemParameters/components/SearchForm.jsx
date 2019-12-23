import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import styles from '../SystemParameters.less';

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search } = this.props;
    return (
      <Form className="ant-advanced-search-form search-wraper">
        <Row gutter={{ xs: 24, sm: 48, md: 144, lg: 48, xl: 96 }} align="middle" type="flex">
          <Col xs={12} sm={12} lg={8}>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.systemParameter.parameterType' })}
            >
              {getFieldDecorator(
                'parameterType',
                {},
              )(
                <Input
                  className={styles.inputvalue}
                  placeholder={`Please Input ${formatMessage({
                    id: 'systemManagement.systemParameter.parameterType',
                  })}`}
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Button type="primary" onClick={search}>
              <IconFont type="iconsousuo" style={{ color: '#fff' }} />
              {formatMessage({ id: 'app.common.search' })}
            </Button>
          </Col>
          {/* <div className="btnArea1"> */}
          {/* <Button type="primary" onClick={search} style={{ marginTop: 28 }}>
            <IconFont type="iconsousuo" style={{ color: '#fff' }} />
            {formatMessage({ id: 'app.common.search' })}
          </Button> */}
          {/* </div> */}
          {/* <Col xs={12} sm={12} lg={16}>
            <Form.Item
              label=" "
            >
              <div className="btnArea1">
                <Button type="primary" onClick={search}>
                  <IconFont type="iconsousuo" style={{ color: '#fff' }} />
                  {formatMessage({ id: 'app.common.search' })}
                </Button>
              </div>
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
    );
  }
}
