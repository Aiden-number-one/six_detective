import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from '../MenuUserGroup.less';
import IconFont from '@/components/IconFont';

export default class SearchForm extends Component {
  state = {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { search } = this.props;
    return (
      <Form className="ant-advanced-search-form search-wraper" layout="vertical">
        <Row gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }} align="middle" type="flex">
          <Col xs={24} sm={12} xl={7} xxl={5}>
            <Form.Item
              label={formatMessage({ id: 'systemManagement.userMaintenance.menuGroupName' })}
            >
              {getFieldDecorator(
                'groupName',
                {},
              )(
                <Input
                  className={styles.inputvalue}
                  placeholder={`Please Input ${formatMessage({
                    id: 'systemManagement.userMaintenance.menuGroupName',
                  })}`}
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} xl={7} xxl={5}>
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
          <Col xs={24} sm={12} xl={7} xxl={5}>
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
