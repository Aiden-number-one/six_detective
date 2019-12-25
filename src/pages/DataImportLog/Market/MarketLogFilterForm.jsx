import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Form, DatePicker, Button, Checkbox, Select, Row, Col } from 'antd';
import { yesterday, today, dateFormat } from '../constants';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const defaultTradeDate = [yesterday, today];
export const defaultMarket = ['HKFE', 'SEHK'];

function MarketLogFilterForm({ form, renderAuto, handleSearch }) {
  const { getFieldDecorator, validateFields } = form;

  function handleClickSearch() {
    validateFields((err, values) => {
      if (!err) {
        const { tradeDate, ...rest } = values;

        handleSearch({
          ...rest,
          tradeDateSt: tradeDate[0],
          tradeDateEt: tradeDate[1],
        });
      }
    });
  }
  return (
    <Form layout="vertical" className="ant-advanced-search-form search-wraper">
      <Row gutter={{ xs: 0, sm: 8, md: 10, lg: 20, xl: 24 }} align="bottom" type="flex">
        <Col xs={24} sm={12} xl={10} xxl={8}>
          <Form.Item label={<FormattedMessage id="data-import.trade-date" />}>
            {getFieldDecorator('tradeDate', {
              initialValue: defaultTradeDate,
              rules: [
                {
                  required: false,
                  message: 'Please select trade date!',
                },
              ],
            })(<RangePicker format={dateFormat} />)}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} xl={7} xxl={5}>
          <Form.Item label={<FormattedMessage id="data-import.market.file-type" />}>
            {getFieldDecorator('fileType', {
              initialValue: '',
              rules: [
                {
                  required: false,
                  message: 'Please select file type!',
                },
              ],
            })(
              <Select placeholder="please select file type" allowClear>
                <Option value="">All</Option>
                <Option value="TP001">TP001</Option>
                <Option value="GREK020">GREK020</Option>
                <Option value="OMD">OMD</Option>
              </Select>,
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
            <Button type="primary" icon="search" onClick={handleClickSearch}>
              <FormattedMessage id="data-import.search" />
            </Button>
            {renderAuto()}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create()(MarketLogFilterForm);
