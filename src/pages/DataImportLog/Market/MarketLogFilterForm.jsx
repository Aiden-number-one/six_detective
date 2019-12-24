import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Form, DatePicker, Button, Checkbox, Select, Row, Col } from 'antd';
import { yesterday, today, dateFormat } from '../constants';
import styles from '../index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

function MarketLogFilterForm({ form, handleSearch }) {
  const { getFieldDecorator, validateFields } = form;

  function handleClick() {
    validateFields((err, values) => {
      if (!err) {
        const format = 'YYYYMMDD';
        const { tradeDate, market, ...rest } = values;
        let startTradeDate = '';
        let endTadeDate = '';

        if (tradeDate) {
          const [start, end] = tradeDate;
          startTradeDate = start && start.format(format);
          endTadeDate = end && end.format(format);
        }

        handleSearch({
          ...rest,
          market: market && market.toString(),
          tradeDateSt: startTradeDate,
          tradeDateEt: endTadeDate,
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
              initialValue: [yesterday, today],
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
              initialValue: ['HKFE', 'SEHK'],
            })(<Checkbox.Group options={['HKFE', 'SEHK']} />)}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <Form.Item>
            <Button
              type="primary"
              icon="search"
              onClick={handleClick}
              className={styles['no-margin']}
            >
              <FormattedMessage id="data-import.search" />
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default Form.create()(MarketLogFilterForm);
