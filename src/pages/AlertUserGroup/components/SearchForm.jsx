import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../AlertUserGroup.less';
import IconFont from '@/components/IconFont';

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
              label={formatMessage({ id: 'systemManagement.userMaintenance.alertGroupName' })}
            >
              {getFieldDecorator(
                'groupName',
                {},
              )(
                <Input
                  className={styles.inputvalue}
                  placeholder={`Please Input ${formatMessage({
                    id: 'systemManagement.userMaintenance.alertGroupName',
                  })}`}
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} lg={8}>
            <Form.Item label={formatMessage({ id: 'systemManagement.userGroup.remark' })}>
              {getFieldDecorator(
                'groupDesc',
                {},
              )(
                <Input
                  className={styles.inputvalue}
                  placeholder={`Please Input ${formatMessage({
                    id: 'systemManagement.userGroup.remark',
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
