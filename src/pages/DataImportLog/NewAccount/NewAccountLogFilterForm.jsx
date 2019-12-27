import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Form, Row, Button, DatePicker, Col, Checkbox, Input } from 'antd';
import { dateFormat, defaultDateRange, defaultMarket } from '../constants';

const { RangePicker } = DatePicker;

function NewAccountFilterForm({ form, loading, onParams }) {
  const { getFieldDecorator, validateFields } = form;

  function getParams(type) {
    validateFields((err, values) => {
      if (!err) {
        const { submissionDate, ...rest } = values;

        onParams(type, {
          ...rest,
          startTradeDate: submissionDate[0],
          endTradeDate: submissionDate[1],
        });
      }
    });
  }

  return (
    <Form layout="vertical" className="ant-advanced-search-form search-wraper">
      <Row gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }} align="bottom" type="flex">
        <Col xs={24} sm={12} xl={10} xxl={8}>
          <Form.Item label={<FormattedMessage id="data-import.submission-date" />}>
            {getFieldDecorator('submissionDate', {
              initialValue: defaultDateRange,
            })(<RangePicker format={dateFormat} />)}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} xl={7} xxl={5}>
          <Form.Item label={<FormattedMessage id="data-import.submitter-code" />}>
            {getFieldDecorator('submitterCode')(
              <Input placeholder="please input submitter code" />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} xl={7} xxl={5}>
          <Form.Item label={<FormattedMessage id="data-import.market" />}>
            {getFieldDecorator('market', {
              initialValue: defaultMarket,
            })(<Checkbox.Group options={['HKFE', 'SEHK']} />)}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <Form.Item>
            <Button
              type="primary"
              icon="search"
              style={{ marginRight: 10 }}
              onClick={() => getParams('newAccount/reload')}
            >
              <FormattedMessage id="data-import.search" />
            </Button>
            <Button
              type="primary"
              onClick={() => getParams('newAccount/importByAuto')}
              loading={loading['newAccount/importByAuto']}
            >
              <FormattedMessage id="data-import.execute" />
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create()(NewAccountFilterForm);
