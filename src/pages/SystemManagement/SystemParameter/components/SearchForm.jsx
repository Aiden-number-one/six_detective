import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import IconFont from '@/components/IconFont';
import styles from '../SystemParameter.less';

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search } = this.props;
    return (
      <Form className="ant-advanced-search-form search-wraper" layout="vertical">
        <Row gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }} align="bottom" type="flex">
          <Col xs={24} sm={12} xl={7} xxl={5}>
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
          <Col xs={24} sm={12} xl={7} xxl={5}>
            <Form.Item>
              <Button type="primary" onClick={search}>
                <IconFont type="iconsousuo" style={{ color: '#fff' }} />
                {formatMessage({ id: 'app.common.search' })}
              </Button>
            </Form.Item>
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
