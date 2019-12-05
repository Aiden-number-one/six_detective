import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Form, DatePicker, Button, Radio, Select, Row, Col } from 'antd';

const { Option } = Select;

function MarketLogFilterForm({ form }) {
  const { getFieldDecorator, validateFields } = form;

  function handleSearch() {
    validateFields((err, values) => {
      console.log(values);
      console.log(values.tradeDate.format('YYYY-MM-DD'));
    });
  }
  return (
    <Form layout="vertical">
      <Row>
        <Col span={7}>
          <Form.Item label={<FormattedMessage id="data-import.market.trade-date" />}>
            {getFieldDecorator('tradeDate', {
              rules: [
                {
                  required: true,
                  message: 'Please select trade date!',
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.market.file-type" />}>
            {getFieldDecorator('fileType', {
              initialValue: 'TP001',
              rules: [
                {
                  required: true,
                  message: 'Please select file type!',
                },
              ],
            })(
              <Select placeholder="please select file type">
                <Option value="TP001">TP001</Option>
                <Option value="GREK020">GREK020</Option>
                <Option value="OMD">OMD</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={7} offset={1}>
          <Form.Item label={<FormattedMessage id="data-import.market.market" />}>
            {getFieldDecorator('market', {
              initialValue: 'HKFE',
            })(
              <Radio.Group>
                <Radio value="HKFE">HKFE</Radio>
                <Radio value="EXHK">EXHK</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" justify="end">
        <Button type="primary" onClick={handleSearch}>
          <FormattedMessage id="data-import.market.search" />
        </Button>
      </Row>
    </Form>
  );
}

export default Form.create()(MarketLogFilterForm);
